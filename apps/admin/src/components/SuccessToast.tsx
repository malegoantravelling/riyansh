import { CheckCircle, XCircle, Info, X, AlertTriangle } from 'lucide-react'
import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  isOpen: boolean
  onClose: () => void
  type: ToastType
  title: string
  message: string
  duration?: number
}

export default function Toast({
  isOpen,
  onClose,
  type,
  title,
  message,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (isOpen && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isOpen, duration, onClose])

  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6" />
      case 'error':
        return <XCircle className="h-6 w-6" />
      case 'warning':
        return <AlertTriangle className="h-6 w-6" />
      case 'info':
        return <Info className="h-6 w-6" />
      default:
        return null
    }
  }

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-600'
      case 'error':
        return 'bg-red-100 text-red-600'
      case 'warning':
        return 'bg-yellow-100 text-yellow-600'
      case 'info':
        return 'bg-blue-100 text-blue-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-l-green-500'
      case 'error':
        return 'border-l-red-500'
      case 'warning':
        return 'border-l-yellow-500'
      case 'info':
        return 'border-l-blue-500'
      default:
        return 'border-l-gray-500'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-[100] animate-slide-in">
      <div
        className={`bg-white rounded-xl shadow-2xl border-l-4 ${getBorderColor()} min-w-[400px] max-w-[500px] overflow-hidden transform transition-all`}
      >
        <div className="p-4 flex items-start gap-4">
          {/* Icon */}
          <div className={`${getIconColor()} rounded-full p-2 flex-shrink-0`}>{getIcon()}</div>

          {/* Content */}
          <div className="flex-1 pt-0.5">
            <h4 className="text-lg font-semibold text-gray-900 mb-1">{title}</h4>
            <p className="text-sm text-gray-600">{message}</p>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-gray-100 relative overflow-hidden">
          <div
            className={`h-full ${getBorderColor()} animate-progress shrink`}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .animate-progress {
          animation: shrink linear forwards;
        }
      `}</style>
    </div>
  )
}
