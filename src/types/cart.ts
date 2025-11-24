import { Database } from './supabase'

// Un produit standard
export type Product = Database['public']['Tables']['products']['Row']

// Un article du panier
export type CartItem = {
  product: Product
  quantity: number
  // NOUVEAUX CHAMPS
  // Liste des IDs des produits inclus dans ce pack (ex: les 3 parfums)
  childProductIds?: string[] 
  // Description textuelle (ex: "Contient: Parfum A, Parfum B...")
  customDescription?: string 
}

export type CartStore = {
  items: CartItem[]
  isOpen: boolean
  // La fonction addItem accepte maintenant des options supplémentaires
  addItem: (product: Product, childProductIds?: string[], customDescription?: string) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  openModal: () => void
  closeModal: () => void
  getCartCount: () => number
  getCartTotal: () => number
}