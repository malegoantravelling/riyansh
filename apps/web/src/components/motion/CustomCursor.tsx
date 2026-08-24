'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Framer-style Circle Cursor (owned port)
 * Pattern: https://framer.com/m/Circle-Cursor-kETd.js
 * White dot + ring with mix-blend-mode: difference (auto-inverts on any background).
 */

const DISABLED_PREFIXES = ['/checkout', '/auth', '/login', '/signup']

const DOT_SIZE = 6
const RING_SIZE = 32
const RING_BORDER = 1.5
const HOVER_SCALE = 1.65
const CLICK_SCALE = 0.75
const DURATION_MS = 200
const CURSOR_COLOR = '#ffffff'

export function CustomCursor() {
  const pathname = usePathname()
  const [enabled, setEnabled] = useState(false)
  const [hidden, setHidden] = useState(true)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [linkHovered, setLinkHovered] = useState(false)
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const disabledRoute = DISABLED_PREFIXES.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`)
    )
    const on = fine && !reduced && !disabledRoute
    setEnabled(on)
    document.documentElement.classList.toggle('has-custom-cursor', on)
    return () => document.documentElement.classList.remove('has-custom-cursor')
  }, [pathname])

  useEffect(() => {
    if (!enabled) return

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setHidden(false)
    }

    const onMouseEnter = () => setHidden(false)
    const onMouseLeave = () => setHidden(true)
    const onMouseDown = () => setClicked(true)
    const onMouseUp = () => setClicked(false)

    const isInteractive = (el: EventTarget | null) => {
      if (!(el instanceof Element)) return false
      return Boolean(
        el.closest(
          'a, button, [role="button"], input, textarea, select, label, summary, [data-cursor], .magnetic-cta'
        )
      )
    }

    const onOver = (e: MouseEvent) => setLinkHovered(isInteractive(e.target))
    const onOut = (e: MouseEvent) => {
      if (!isInteractive(e.relatedTarget)) setLinkHovered(false)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [enabled])

  if (!enabled) return null

  const scale = linkHovered ? HOVER_SCALE : clicked ? CLICK_SCALE : 1
  const opacity = hidden ? 0 : 1
  const transition = `all ${DURATION_MS}ms ease`

  return (
    <>
      {/* Center dot — mix-blend-difference needs no isolating parent */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[10000] hidden rounded-full lg:block"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          backgroundColor: CURSOR_COLOR,
          mixBlendMode: 'difference',
          opacity,
          transform: `translate3d(${position.x - DOT_SIZE / 2}px, ${position.y - DOT_SIZE / 2}px, 0)`,
          transition: `opacity ${DURATION_MS}ms ease`,
          willChange: 'transform',
        }}
      />

      {/* Outer ring */}
      <div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden rounded-full lg:block"
        style={{
          width: RING_SIZE,
          height: RING_SIZE,
          border: `${RING_BORDER}px solid ${CURSOR_COLOR}`,
          backgroundColor: linkHovered ? 'rgba(255,255,255,0.12)' : 'transparent',
          mixBlendMode: 'difference',
          opacity,
          transform: `translate3d(${position.x - RING_SIZE / 2}px, ${position.y - RING_SIZE / 2}px, 0) scale(${scale})`,
          transition,
          willChange: 'transform',
        }}
      />
    </>
  )
}
