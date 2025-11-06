import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, CartStore, Product } from '@/types/cart'
import toast from 'react-hot-toast'

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // Actions
      openModal: () => set({ isOpen: true }),
      closeModal: () => set({ isOpen: false }),

      addItem: (product: Product) => {
        const currentItems = get().items
        const existingItem = currentItems.find(
          (item) => item.product.id === product.id
        )

        if (existingItem) {
          // If item already in cart, increment quantity
          set({
            items: currentItems.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          })
          toast.success('Item quantity increased')
        } else {
          // If new item, add to cart
          set({ items: [...currentItems, { product, quantity: 1 }] })
          toast.success('Item added to cart')
        }
        
        // Open cart modal when item is added
        get().openModal()
      },

      removeItem: (productId: string) => {
        set({
          items: get().items.filter((item) => item.product.id !== productId),
        })
        toast.error('Item removed from cart')
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity < 1) {
          // If quantity is 0 or less, remove the item
          get().removeItem(productId)
        } else {
          set({
            items: get().items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          })
          toast.success('Quantity updated')
        }
      },

      clearCart: () => set({ items: [] }),

      // Selectors (computed values)
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
      name: 'ih-cart-storage', // name of the item in localStorage
    }
  )
)