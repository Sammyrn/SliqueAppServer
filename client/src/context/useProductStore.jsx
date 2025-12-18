import { create } from "zustand";
import Axios, { axiosPrivate } from "../config/axios";

const useProductStore = create()((set) => ({
  products: [],
  loading: false,

  getProduct: async () => {
    set({ loading: true });
    try {
      const response = await Axios.get(`/product/getAll`);
      const parseArr = response.data.map((data) => ({
        ...data,
        image_url: JSON.parse(data.image_url),
      }));
      set({ products: parseArr, loading: false });
      //console.log("Products fetched successfully:", useProductStore.getState().products);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      set({ loading: false });
    }
  },
  getProductById: async (id) => {
    set({ loading: true });
    try {
      const result = await Axios.get(`/product/get/${id}`);
      if (result.data.message === "success") {
        return result.data.product;
      }
    } catch (e) {
      console.log(e);
    } finally {
      set({ loading: false });
    }
  },
  updateProductStock: async (data) => {
    const { id, stock } = data;
    set({ loading: true });
    // Validate id and data
    if (!id || !data || typeof data !== "object") {
      console.error("Invalid data provided for updateProduct");
      return;
    }
    try {
      const response = await axiosPrivate.put(`/product/update/${id}`, {
        stock,
      });
      if (response.data.message === "success") {
        set((state) => ({
          products: state.products.map((item) =>
            item.id === id ? { ...item, ...data } : item
          ),
        }));
      }
    } catch (error) {
      console.error("Error updating products:", error);
    } finally {
      set({ loading: false });
    }
  },
  deleteProductById: async (id) => {
    set({ loading: true });
    try {
      const result = await axiosPrivate.delete(`/product/delete/${id}`);
      if (result.data.message === "success") {
        set((state) => ({
          products: state.products.filter((item) => item.id !== id),
        }));
      }
      return 'success'
    } catch (e) {
      console.log(e);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useProductStore;
