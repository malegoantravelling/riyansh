/**
 * Module-level in-memory product cache with TTL.
 * Because this module is loaded once per server process, the cache persists
 * across navigations without any external store, making subsequent page loads
 * near-instant (0ms vs 300-800ms Supabase round-trip).
 *
 * TTL = 5 minutes. Cache is invalidated automatically after that.
 */

import { supabase } from './supabase'

interface CacheEntry {
  data: any[]
  fetchedAt: number
}

// 5-minute TTL (milliseconds)
const TTL_MS = 5 * 60 * 1000

// Module-level singleton cache
let cache: CacheEntry | null = null

// Singleton in-flight promise to prevent duplicate simultaneous fetches
let inFlight: Promise<any[]> | null = null

export async function getCachedProducts(): Promise<any[]> {
  const now = Date.now()

  // Return from cache if still fresh
  if (cache && now - cache.fetchedAt < TTL_MS) {
    return cache.data
  }

  // If a fetch is already in progress, wait for it rather than launching a second
  if (inFlight) {
    return inFlight
  }

  // Launch new fetch
  inFlight = (async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (!error && Array.isArray(data) && data.length > 0) {
        cache = { data, fetchedAt: Date.now() }
        return data
      }

      // Return stale cache if network error and we have old data
      if (cache) return cache.data
      return []
    } catch (err) {
      console.warn('[productCache] Supabase fetch failed:', err)
      if (cache) return cache.data
      return []
    } finally {
      inFlight = null
    }
  })()

  return inFlight
}

/** Force-invalidate the cache (call after admin updates a product) */
export function invalidateProductCache() {
  cache = null
}
