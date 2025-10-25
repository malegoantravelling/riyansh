'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import Toast, { Toast as ToastType, ToastType as ToastVariant } from '@/components/ui/toast'

interface ToastContextType {
  toast: (options: {
    type: ToastVariant
    title: string
    description?: string
    duration?: number
  }) => void
  success: (title: string, description?: string, duration?: number) => void
  error: (title: string, description?: string, duration?: number) => void
  info: (title: string, description?: string, duration?: number) => void
  warning: (title: string, description?: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastType[]>([])

  const addToast = useCallback(
    (options: { type: ToastVariant; title: string; description?: string; duration?: number }) => {
      const id = Math.random().toString(36).substring(7)
      const newToast: ToastType = {
        id,
        type: options.type,
        title: options.title,
        description: options.description,
        duration: options.duration || 5000,
      }
      setToasts((prev) => [...prev, newToast])
    },
    []
  )

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const success = useCallback(
    (title: string, description?: string, duration?: number) => {
      addToast({ type: 'success', title, description, duration })
    },
    [addToast]
  )

  const error = useCallback(
    (title: string, description?: string, duration?: number) => {
      addToast({ type: 'error', title, description, duration })
    },
    [addToast]
  )

  const info = useCallback(
    (title: string, description?: string, duration?: number) => {
      addToast({ type: 'info', title, description, duration })
    },
    [addToast]
  )

  const warning = useCallback(
    (title: string, description?: string, duration?: number) => {
      addToast({ type: 'warning', title, description, duration })
    },
    [addToast]
  )

  return (
    <ToastContext.Provider value={{ toast: addToast, success, error, info, warning }}>
      {children}
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none">
        <div className="flex flex-col gap-3 pointer-events-auto">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} onClose={removeToast} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  )
}
