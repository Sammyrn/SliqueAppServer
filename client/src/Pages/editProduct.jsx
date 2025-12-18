import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosPrivate } from "../config/axios";
import useProductStore from "../context/useProductStore";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    stock: 0,
    images: [],
    existingImages: [],
  });
  const [error, setError] = useState("");
  const { getProductById, deleteProductById } = useProductStore();
  const [loading, setLoading] = useState(true);
  const [previews, setPreviews] = useState([]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "images") {
      const selectedFiles = Array.from(files || []);
      setForm({ ...form, images: selectedFiles });

      if (selectedFiles.length === 0) {
        setPreviews([]);
        return;
      }

      Promise.all(
        selectedFiles.map(
          (file) =>
            new Promise((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.readAsDataURL(file);
            })
        )
      ).then((urls) => setPreviews(urls));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const getForm = async () => {
    try {
      const res = await getProductById(id);
      setForm({
        name: res.name,
        price: res.price,
        description: res.description,
        stock: res.stock,
        images: [],
        existingImages: Array.isArray(res.image_url)
          ? res.image_url
          : (() => {
              try {
                return JSON.parse(res.image_url || "[]");
              } catch {
                return [];
              }
            })(),
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getForm();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("id", String(id));
      formData.append("name", form.name);
      formData.append("price", String(Number(form.price)));
      formData.append("description", form.description);
      formData.append("stock", form.stock);
      form.images.forEach((file) => formData.append("images", file));

      await axiosPrivate.post("/product/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product.");
    } finally {
      setLoading(false);
    }
  };

  const removeSelectedImageAt = (index) => {
    setPreviews(previews.filter((_, i) => i !== index));
    setForm({ ...form, images: form.images.filter((_, i) => i !== index) });
  };

  return (
    <div className="container mx-auto p-6">
      {/* back Btn */}
      <div
        onClick={() => navigate("/admin/products")}
        className="rounded-full p-2 w-fit bg-pink-50 mb-3"
      ></div>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-2">
        <div>
          <h1 className="text-3xl font-bold">Edit Product</h1>
          <p className="text-gray-600 font-semibold">
            Home {">"} All Products {">"} Edit Product
          </p>
        </div>
        <div
          onClick={async () => {
            if (window.confirm("Are you sure you want to delete this item?")) {
              const deleteResult = await deleteProductById(id);
              if (deleteResult === "success") {
                navigate("/admin/products");
              } else {
                setError("Failed to delete product");
              }
            }
          }}
          className="flex items-center gap-2 my-3 rounded-xl px-5 py-2 uppercase font-semibold bg-red-200 text-xs md:text-base cursor-pointer shadow transition"
        >
          <img src="/bin.png" alt="bin" />
          <p className="font-semibold text-red-500">DELETE</p>
        </div>
      </div>
      <div className="pb-5 rounded w-full mx-auto flex flex-col md:flex-row gap-6">
        <form onSubmit={handleSubmit} className="flex-1 md:max-w-1/2 space-y-4">
          <div>
            <label className="block font-semibold mb-1">Product Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-4 focus:ring-pink-200"
              required
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-2 border rounded focus:outline-none focus:ring-4 focus:ring-pink-200"
              rows={3}
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-4 focus:ring-pink-200"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block font-semibold mb-1">Add New Images</label>
              <input
                type="file"
                name="images"
                accept="image/*"
                onChange={handleChange}
                multiple
                className="w-full p-2 border rounded cursor-pointer focus:outline-none focus:ring-4 focus:ring-pink-200"
              />
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-pink-500 hover:bg-pink-500 text-white font-semibold px-4 py-2 rounded transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
        <div className="flex-1 flex flex-col gap-4 mt-6 md:mt-0">
          {form.existingImages?.length > 0 && (
            <div className="border-2 border-gray-200 rounded bg-gray-50">
              <div className="px-3 py-2 font-semibold">Existing Images</div>
              <div className="flex flex-wrap gap-2 p-3">
                {form.existingImages.map((src, i) => (
                  <img
                    key={`ex-${i}`}
                    src={src}
                    alt={`Existing ${i + 1}`}
                    className="w-24 h-24 object-cover rounded shadow"
                  />
                ))}
              </div>
            </div>
          )}
          {previews.length > 0 && (
            <div className="border-2 border-gray-200 rounded bg-gray-50">
              <div className="px-3 py-2 font-semibold">New Images</div>
              <div className="flex flex-col gap-2 p-3">
                {previews.map((src, i) => (
                  <div
                    key={`new-${i}`}
                    className="w-full bg-white rounded shadow flex justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={src}
                        alt={`Preview ${i + 1}`}
                        className="w-24 h-24 object-cover"
                      />
                      <span>{"Image preview " + (i + 1)}</span>
                    </div>
                    <img
                      src="/bin.png"
                      className="object-contain mr-3 cursor-pointer"
                      onClick={() => removeSelectedImageAt(i)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
