import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, CartStore, Product } from '@/types/cart'
import toast from 'react-hot-toast'

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openModal: () => set({ isOpen: true }),
      closeModal: () => set({ isOpen: false }),

      // Mise à jour : accepte les sous-produits et la description
      addItem: (product: Product, childProductIds?: string[], customDescription?: string) => {
        const currentItems = get().items
        
        // Pour les coffrets, on utilise un ID unique basé sur le temps pour éviter de fusionner
        // des coffrets différents. Pour les produits normaux, on utilise l'ID du produit.
        const uniqueId = childProductIds ? `${product.id}-${Date.now()}` : product.id
        
        // On crée un clone du produit avec cet ID unique si c'est un coffret
        const productToAdd = childProductIds ? { ...product, id: uniqueId } : product

        const existingItem = currentItems.find((item) => item.product.id === uniqueId)

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.product.id === uniqueId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          })
          toast.success('Quantité mise à jour')
        } else {
          set({
            items: [
              ...currentItems,
              { 
                product: productToAdd, 
                quantity: 1,
                childProductIds,      // Sauvegarde les IDs
                customDescription     // Sauvegarde la description
              }
            ]
          })
          toast.success('Ajouté au panier')
        }
        
        get().openModal()
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        })
        toast.error('Retiré du panier')
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity < 1) {
          get().removeItem(productId)
        } else {
          set({
            items: get().items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          })
        }
      },

      clearCart: () => set({ items: [] }),

      getCartCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getCartTotal: () => {
        return get().items.reduce((total, item) => {
          return total + (item.product.price ?? 0) * item.quantity
        }, 0)
      },
    }),
    {
      name: 'ih-cart-storage',
    }
  )
)