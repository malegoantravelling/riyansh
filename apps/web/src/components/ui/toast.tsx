'use client'

import * as React from 'react'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface Toast {
  id: string
  type: ToastType
  title: string
  description?: string
  duration?: number
}

interface ToastProps {
  toast: Toast
  onClose: (id: string) => void
}

const Toast = ({ toast, onClose }: ToastProps) => {
  const [isExiting, setIsExiting] = React.useState(false)

  React.useEffect(() => {
    const duration = toast.duration || 5000
    const timer = setTimeout(() => {
      setIsExiting(true)
      setTimeout(() => onClose(toast.id), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onClose])

  const handleClose = () => {
    setIsExiting(true)
    setTimeout(() => onClose(toast.id), 300)
  }

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-evergreen" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-[var(--error)]" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-[var(--warning)]" />
      case 'info':
        return <Info className="h-5 w-5 text-[var(--info)]" />
      default: {
        const _exhaustive: never = toast.type
        return _exhaustive
      }
    }
  }

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-l-evergreen'
      case 'error':
        return 'border-l-[var(--error)]'
      case 'warning':
        return 'border-l-[var(--warning)]'
      case 'info':
        return 'border-l-[var(--info)]'
      default: {
        const _exhaustive: never = toast.type
        return _exhaustive
      }
    }
  }

  const progressColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-evergreen'
      case 'error':
        return 'bg-[var(--error)]'
      case 'warning':
        return 'bg-[var(--warning)]'
      case 'info':
        return 'bg-[var(--info)]'
      default: {
        const _exhaustive: never = toast.type
        return _exhaustive
      }
    }
  }

  return (
    <div
      className={`
        group relative w-full max-w-md overflow-hidden rounded-2xl border border-evergreen/8 border-l-4 bg-white/95 shadow-lift backdrop-blur-md transition-all duration-300
        ${getBorderColor()}
        ${isExiting ? 'translate-x-full scale-95 opacity-0' : 'translate-x-0 scale-100 opacity-100'}
      `}
    >
      <div className="absolute left-0 top-0 h-1 w-full overflow-hidden bg-jade/30">
        <div
          className={`h-full ${progressColor()}`}
          style={{
            animation: `toast-progress ${toast.duration || 5000}ms linear forwards`,
          }}
        />
      </div>

      <div className="p-4 pr-12">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex-shrink-0">{getIcon()}</div>
          <div className="min-w-0 flex-1">
            <h3 className="mb-1 text-sm font-bold text-evergreen">{toast.title}</h3>
            {toast.description && (
              <p className="text-sm leading-relaxed text-dusty-olive">{toast.description}</p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleClose}
        className="absolute right-3 top-3 rounded-lg p-1.5 text-dusty-olive transition-all duration-200 hover:bg-jade/40 hover:text-evergreen"
        aria-label="Close notification"
        type="button"
      >
        <X className="h-4 w-4" />
      </button>

      <style jsx>{`
        @keyframes toast-progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  )
}

export default Toast
