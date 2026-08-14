'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

function FailureContent() {
  const params = useSearchParams()
  const reason = params.get('reason')
  const status = params.get('status')
  const orderId = params.get('order_id')
  const message = params.get('message')

  return (
    <div className="page-shell surface-band flex min-h-[60vh] items-center justify-center px-4">
      <div className="surface-glass w-full max-w-md rounded-2xl p-8 text-center">
        <XCircle className="h-14 w-14 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#013220]">Payment failed</h1>
        <p className="mt-2 text-sm text-[#80866e]">
          {message || 'Your PayU payment was not completed. You can try again from checkout.'}
        </p>
        {(status || reason || orderId) && (
          <p className="mt-4 text-xs text-[#80866e]">
            {orderId && (
              <>
                Order: <span className="font-mono">{orderId}</span>
                <br />
              </>
            )}
            {status && (
              <>
                Status: {status}
                <br />
              </>
            )}
            {reason && <>Reason: {reason}</>}
          </p>
        )}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/checkout">
            <Button className="bg-[#013220] hover:bg-[#012418] w-full">Try again</Button>
          </Link>
          <Link href="/account/orders">
            <Button variant="outline" className="w-full">
              My Orders
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderFailurePage() {
  return (
    <Suspense
      fallback={<div className="min-h-[40vh] flex items-center justify-center">Loading…</div>}
    >
      <FailureContent />
    </Suspense>
  )
}
