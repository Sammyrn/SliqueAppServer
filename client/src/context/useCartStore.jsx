import { create } from "zustand";
import { axiosPrivate } from "../config/axios";

const useCartStore = create()((set) => ({
  cart: [],
  cartLoading: false,

  getCartItems: async () => {
    set({ cartLoading: true });
    try {
      const result = await axiosPrivate.get(`/cart/`);
      if (result.data.message === "success") {
        const parseArr = result.data.rows.map((data) => ({
          ...data,
          image_url: JSON.parse(data.image_url),
        }));
        set({ cart: parseArr });
      }
    } catch (error) {
      console.log(error);
    } finally {
      set({ cartLoading: false });
    }
  },

  addToCart: async (productId, quantity) => {
    set({ cartLoading: true });
    //console.log("Adding to cart:", productId, quantity);
    try {
      const result = await axiosPrivate.post("/cart/add", {
        productId,
        quantity,
      });
      if (result.data.message === "success") {
        set((state) => ({
          cart: [...state.cart, result.data.product],
        }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      set({ cartLoading: false });
    }
  },
  removeFromCart: async (productId) => {
    set({ cartLoading: true });
    try {
      const result = await axiosPrivate.delete(`/cart/delete/${productId}`);
      if (result.data.message === "success") {
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        }));
      }
    } catch (error) {
      console.log(error);
    } finally {
      set({ cartLoading: false });
    }
  },
  clearCart: async () => {
    set({ cartLoading: true });
    try {
      const result = await axiosPrivate.delete("/cart/clear");
      if (result.data.message === "success") {
        set({ cart: [] });
      }
    } catch (error) {
      console.log(error);
    } finally {
      set({ cartLoading: false });
    }
  },
  updateCartItem: async (productId, quantity) => {
    try {
      const result = await axiosPrivate.put(`/cart/update/${productId}`, {
        quantity,
      });
      if (result.data.message === "success") {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      }
    } catch (error) {
      console.log(error);
    }
  },
  initializeTransaction: async () => {},
  getCartCount: () => {
    return useCartStore.getState().cart.length;
  },
  getCartTotal: () => {
    return useCartStore
      .getState()
      .cart.reduce((total, item) => total + item.price * item.quantity, 0);
  },
  getShippingPrice: async (state) => {
    try {
      const result = await axiosPrivate.post("/cart/shipping", {state});
      if (result.data.message === "success") {
        const shippingPrice = result.data.price;
        return shippingPrice;
      }
    } catch (e) {
      console.log('ERROR GETTING SHIPPING PRICE',e);
    }
  },
}));

export default useCartStore;
