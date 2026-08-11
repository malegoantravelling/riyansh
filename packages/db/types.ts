export interface User {
  id: string
  email: string
  full_name?: string
  phone?: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image_url?: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  compare_at_price?: number
  category_id?: string
  image_url?: string
  images?: string[]
  stock_quantity: number
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
  category?: Category
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  created_at: string
  updated_at: string
  product?: Product
}

export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: Product
}

export type OrderStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export interface Order {
  id: string
  user_id: string
  total_amount: number
  status: OrderStatus
  shipping_address?: Record<string, unknown>
  billing_address?: Record<string, unknown>
  notes?: string
  payu_txnid?: string
  payu_mihpayid?: string
  payu_status?: string
  paid_at?: string
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id?: string
  product_name: string
  product_image?: string
  quantity: number
  price: number
  created_at: string
}

export interface Transaction {
  id: string
  user_id?: string
  order_id?: string
  amount: number
  currency: string
  status: string
  payment_method?: string
  description?: string
  payu_txnid?: string
  mihpayid?: string
  mode?: string
  raw_response?: Record<string, unknown>
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}
