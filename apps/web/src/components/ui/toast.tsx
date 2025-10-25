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
        return <CheckCircle2 className="h-5 w-5 text-[#8BC34A]" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-l-[#8BC34A]'
      case 'error':
        return 'border-l-red-500'
      case 'warning':
        return 'border-l-yellow-500'
      case 'info':
        return 'border-l-blue-500'
    }
  }

  return (
    <div
      className={`
        group relative w-full max-w-md bg-white rounded-xl shadow-2xl border-l-4 ${getBorderColor()}
        overflow-hidden backdrop-blur-sm transition-all duration-300
        ${isExiting ? 'opacity-0 translate-x-full scale-95' : 'opacity-100 translate-x-0 scale-100'}
      `}
    >
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 h-1 bg-gray-100 w-full overflow-hidden">
        <div
          className={`h-full ${
            toast.type === 'success'
              ? 'bg-[#8BC34A]'
              : toast.type === 'error'
              ? 'bg-red-500'
              : toast.type === 'warning'
              ? 'bg-yellow-500'
              : 'bg-blue-500'
          }`}
          style={{
            animation: `progress ${toast.duration || 5000}ms linear forwards`,
          }}
        />
      </div>

      <div className="p-4 pr-12">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-bold text-[#2d2d2d] mb-1">{toast.title}</h3>
            {toast.description && (
              <p className="text-sm text-[#666666] leading-relaxed">{toast.description}</p>
            )}
          </div>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-[#2d2d2d] hover:bg-gray-100 transition-all duration-200"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>

      <style jsx>{`
        @keyframes progress {
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
