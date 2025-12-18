import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "../config/axios";

const AddNewProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: "",
    images: [],
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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

  //console.log(form)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", String(Number(form.price)));
      formData.append("description", form.description);

      form.images.forEach((image) => {
        formData.append("images", image);
      });

      const result = await Axios.post("/product/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (result.data.message === "success") {
        navigate("/admin/products");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeImageAt = (index) => {
    setPreviews(previews.filter((_, i) => i !== index));
    setForm({
      ...form,
      images: form.images.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="container mx-auto p-6">
      {/* back Btn */}
      <div
        onClick={() => navigate("/admin/products")}
        className="rounded-full p-2 w-fit bg-pink-50 mb-3"
      ></div>
      <div className="flex flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-gray-600 font-semibold">
            Home {">"} All Products {">"} Add New Product
          </p>
        </div>
      </div>
      <div className="py-5 rounded w-full mx-auto flex flex-col md:flex-row gap-6">
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
              <label className="block font-semibold mb-1">Gallery</label>
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
            {loading ? "Adding..." : "Add Product"}
          </button>
        </form>
        {previews.length > 0 && (
          <div className="flex-1 flex flex-col  border-2 border-gray-200 rounded min-h-[200px] bg-gray-50 mt-6 md:mt-0">
            <div className="flex flex-wrap gap-2 p-3 flex-col">
              {previews.map((src, i) => (
                <div
                  key={i}
                  className="w-full bg-white rounded shadow flex justify-between"
                >
                  <div className=" flex items-center gap-3">
                    <img
                      src={src}
                      alt={`Preview ${i + 1}`}
                      className="w-24 h-24 object-cover "
                    />
                    <span>{"Image preview " + (i + 1)}</span>
                  </div>
                  <img
                    src="/bin.png"
                    className="object-contain mr-3 cursor-pointer"
                    onClick={() => removeImageAt(i)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddNewProduct;
