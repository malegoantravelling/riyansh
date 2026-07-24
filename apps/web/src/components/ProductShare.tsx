'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Link2,
  Share2,
  Mail,
  MessageCircle,
  Facebook,
  Twitter,
  Smartphone,
  Check,
} from 'lucide-react'
import { useToast } from '@/contexts/ToastContext'

interface ProductShareProps {
  slug: string
  name: string
  price?: number
  variant?: 'detail' | 'icon'
}

function getProductUrl(slug: string) {
  if (typeof window === 'undefined') return `/products/${slug}`
  return `${window.location.origin}/products/${slug}`
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall through to legacy method
  }

  try {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.setAttribute('readonly', '')
    textarea.style.position = 'fixed'
    textarea.style.left = '-9999px'
    document.body.appendChild(textarea)
    textarea.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(textarea)
    return ok
  } catch {
    return false
  }
}

export default function ProductShare({
  slug,
  name,
  price,
  variant = 'detail',
}: ProductShareProps) {
  const toast = useToast()
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const url = getProductUrl(slug)
  const shareText = price
    ? `Check out ${name} (₹${price.toLocaleString('en-IN')}) on Riyansh`
    : `Check out ${name} on Riyansh`

  useEffect(() => {
    setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function')
  }, [])

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const handleCopy = useCallback(
    async (e?: React.MouseEvent) => {
      e?.preventDefault()
      e?.stopPropagation()
      const ok = await copyToClipboard(url)
      if (ok) {
        setCopied(true)
        toast.success('Link copied', 'Product link copied to clipboard.')
        setTimeout(() => setCopied(false), 2000)
      } else {
        toast.error('Copy failed', 'Could not copy the link. Please try again.')
      }
    },
    [toast, url]
  )

  const openShareWindow = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500')
    setOpen(false)
  }

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    openShareWindow(`https://wa.me/?text=${encodeURIComponent(`${shareText}\n${url}`)}`)
  }

  const handleFacebook = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    openShareWindow(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    )
  }

  const handleTwitter = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    openShareWindow(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`
    )
  }

  const handleEmail = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.location.href = `mailto:?subject=${encodeURIComponent(name)}&body=${encodeURIComponent(`${shareText}\n\n${url}`)}`
    setOpen(false)
  }

  const handleNativeShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      await navigator.share({
        title: name,
        text: shareText,
        url,
      })
      setOpen(false)
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        toast.error('Share failed', 'Could not open the share dialog.')
      }
    }
  }

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen((v) => !v)
  }

  const menuItems = (
    <div
      role="menu"
      className={`absolute z-30 w-52 rounded-lg border border-gray-200 bg-white py-1.5 shadow-xl ${
        variant === 'icon' ? 'right-0 top-full mt-1.5' : 'left-0 top-full mt-2'
      }`}
    >
      <button
        type="button"
        role="menuitem"
        onClick={handleCopy}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[#333333] hover:bg-[#F6F0E2] hover:text-[#5B8C51]"
      >
        {copied ? <Check className="h-4 w-4 text-[#5B8C51]" /> : <Link2 className="h-4 w-4" />}
        {copied ? 'Copied!' : 'Copy link'}
      </button>
      <button
        type="button"
        role="menuitem"
        onClick={handleWhatsApp}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[#333333] hover:bg-[#F6F0E2] hover:text-[#5B8C51]"
      >
        <MessageCircle className="h-4 w-4" />
        WhatsApp
      </button>
      <button
        type="button"
        role="menuitem"
        onClick={handleFacebook}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[#333333] hover:bg-[#F6F0E2] hover:text-[#5B8C51]"
      >
        <Facebook className="h-4 w-4" />
        Facebook
      </button>
      <button
        type="button"
        role="menuitem"
        onClick={handleTwitter}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[#333333] hover:bg-[#F6F0E2] hover:text-[#5B8C51]"
      >
        <Twitter className="h-4 w-4" />
        X / Twitter
      </button>
      <button
        type="button"
        role="menuitem"
        onClick={handleEmail}
        className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm text-[#333333] hover:bg-[#F6F0E2] hover:text-[#5B8C51]"
      >
        <Mail className="h-4 w-4" />
        Email
      </button>
      {canNativeShare && (
        <button
          type="button"
          role="menuitem"
          onClick={handleNativeShare}
          className="flex w-full items-center gap-2.5 border-t border-gray-100 px-3 py-2 text-left text-sm text-[#333333] hover:bg-[#F6F0E2] hover:text-[#5B8C51]"
        >
          <Smartphone className="h-4 w-4" />
          More options
        </button>
      )}
    </div>
  )

  if (variant === 'icon') {
    return (
      <div ref={rootRef} className="relative">
        <button
          type="button"
          onClick={toggleMenu}
          className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:border-[#5B8C51] transition-colors bg-white shadow-sm"
          aria-label="Share product"
          aria-expanded={open}
          aria-haspopup="menu"
        >
          <Share2 className="h-4 w-4 text-[#5B8C51]" />
        </button>
        {open ? menuItems : null}
      </div>
    )
  }

  return (
    <div ref={rootRef} className="relative flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-gray-300 bg-white text-xs sm:text-sm font-semibold text-[#333333] hover:border-[#5B8C51] hover:text-[#5B8C51] transition-colors"
        aria-label="Copy product link"
      >
        {copied ? (
          <Check className="h-4 w-4 text-[#5B8C51]" />
        ) : (
          <Link2 className="h-4 w-4" />
        )}
        {copied ? 'Copied!' : 'Copy link'}
      </button>

      <button
        type="button"
        onClick={toggleMenu}
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-[#5B8C51] bg-white text-xs sm:text-sm font-semibold text-[#5B8C51] hover:bg-[#5B8C51] hover:text-white transition-colors"
        aria-label="Share product"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <Share2 className="h-4 w-4" />
        Share
      </button>

      {open ? menuItems : null}
    </div>
  )
}
