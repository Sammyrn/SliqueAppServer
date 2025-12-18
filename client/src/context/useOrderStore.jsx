import { create } from "zustand";
import { axiosPrivate } from "../config/axios";

const useOrderStore = create()((set) => ({
  orders: [],
  loading: false,

  getOrdersItems: async () => {
    set({ loading: true });
    try {
      const result = await axiosPrivate.get(`/orders/getAll`);
      if (result.data.message === "success") {
        set({ orders: result.data.rows });
      }
    } catch (error) {
      console.log(error);
    } finally {
      set({ loading: false });
    }
  },

  // createOrder: async (productId, quantity) => {
  //   set({ loading: true });
  //   console.log("Adding to cart:", productId, quantity);
  //   try {
  //     const result = await axiosPrivate.post("/cart/add", {
  //       productId,
  //       quantity,
  //     });
  //     if (result.data.message === "success") {
  //       set((state) => ({
  //         cart: [...state.cart, result.data.product],
  //       }));
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     set({ cartLoading: false });
  //   }
  // },

  // removeFromOrders: async (orderID) => {
  //   set({ loading: true });
  //   try {
  //     const result = await axiosPrivate.delete(`/orders/delete/${orderID}`);
  //     if (result.data.message === "success") {
  //       set((state) => ({
  //         orders: state.orders.filter((item) => item.id !== orderID),
  //       }));
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     set({ loading: false });
  //   }
  // },

  // updateordersItem: async (orderID, quantity) => {
  //   try {
  //     const result = await axiosPrivate.put(`/orders/update/${orderID}`, {
  //       quantity,
  //     });
  //     if (result.data.message === "success") {
  //       set((state) => ({
  //         orders: state.orders.map((item) =>
  //           item.id === orderID ? { ...item, quantity } : item
  //         ),
  //       }));
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
}));

export default useOrderStore;
