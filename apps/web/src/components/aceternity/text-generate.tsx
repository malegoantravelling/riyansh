'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type TextGenerateEffectProps = {
  words: string
  className?: string
  filter?: boolean
}

/** Aceternity-inspired word-by-word reveal for headlines */
export function TextGenerateEffect({ words, className, filter = true }: TextGenerateEffectProps) {
  const [visible, setVisible] = useState(0)
  const parts = words.split(' ')

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      setVisible(parts.length)
      return
    }
    setVisible(0)
    let i = 0
    const id = window.setInterval(() => {
      i += 1
      setVisible(i)
      if (i >= parts.length) window.clearInterval(id)
    }, 80)
    return () => window.clearInterval(id)
  }, [words, parts.length])

  return (
    <span className={cn('inline', className)}>
      {parts.map((word, idx) => (
        <span
          key={`${word}-${idx}`}
          className={cn(
            'mr-[0.28em] inline-block transition-all duration-500 ease-premium',
            idx < visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
            filter && idx < visible ? 'blur-0' : filter ? 'blur-sm' : ''
          )}
        >
          {word}
        </span>
      ))}
    </span>
  )
}
