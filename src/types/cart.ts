import { Database } from './supabase'

// A product from the 'products' table
export type Product = Database['public']['Tables']['products']['Row']

// A cart item, which is a product plus a quantity
export type CartItem = {
  product: Product
  quantity: number
}

// The state and actions for our cart store
export type CartStore = {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  openModal: () => void
  closeModal: () => void
  getCartCount: () => number
  getCartTotal: () => number
}