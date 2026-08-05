export const WHATSAPP_NUMBER = '918605911293'

export interface WhatsAppOrderItem {
  name: string
  quantity: number
  price: number
}

export function buildWhatsAppOrderUrl(
  items: WhatsAppOrderItem[],
  note?: string
): string {
  const billText = items
    .map(
      (item, idx) =>
        `${idx + 1}. ${item.name}\n   Qty: ${item.quantity} × ₹${item.price.toLocaleString()} = ₹${(item.price * item.quantity).toLocaleString()}`
    )
    .join('\n\n')

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const noteBlock = note?.trim() ? `\n\nOrder Note:\n${note.trim()}` : ''

  const message = `Hello Riyansh Amrit! I want to place an order.

Order Details:
${billText}

Total Amount: ₹${subtotal.toLocaleString()}${noteBlock}`

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

export function openWhatsAppOrder(items: WhatsAppOrderItem[], note?: string) {
  window.location.href = buildWhatsAppOrderUrl(items, note)
}
