import ReactPaginate from "react-paginate";
import { Link, useNavigate } from "react-router-dom";
import useProductStore from "../context/useProductStore";
import { useEffect, useState } from "react";
import Loading from "../components/loading";

const AdminProducts = () => {
  const navigate = useNavigate();
  const { products, loading, updateProductStock, getProduct } = useProductStore();
  const [itemsOffset, setItemsOffset] = useState(0);

  const itemsPerPage = 8; // Number of items per page

  const endOffset = itemsOffset + itemsPerPage;
  const pageCount = Math.ceil(products.length / itemsPerPage);
  const currentItems = products.slice(itemsOffset, endOffset);
  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % products.length;
    //console.log(event, newOffset, orders.length);

    setItemsOffset(newOffset);
  };

  // avoid long descriptions with reduce
  const reduce = (str) => {
    if (!str) return "";
    return str.length > 70 ? str.slice(0, 70) + "..." : str;
  };

  const handleStockChange = (id) => {
    // api call to update stock status
    const product = products.find((item) => item.id === id);
    if (product) {
      const updatedProduct = { ...product, stock: product.stock === 1 ? 0 : 1 };
      //console.log("Product to update:", updatedProduct);
      updateProductStock(updatedProduct);
    }
  };

  useEffect(() => {
    // Fetch products when component mounts
    // This is handled by the useProductStore hook, so no need for additional API calls here
    getProduct();
  }, []);
  return (
    <div className="container mx-auto px-2 md:px-6 py-4">
      {loading && <Loading />}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-2">
        <div>
          <h1 className="text-xl md:text-3xl font-bold">All Products</h1>
          <p className="text-xs md:text-lg text-gray-600 font-semibold">
            Home {">"} All Products
          </p>
        </div>
        <button
          onClick={() => navigate("./addNewProduct")}
          className="rounded-xl px-4 py-2 uppercase font-semibold bg-pink-200 hover:bg-pink-500 hover:text-white text-xs md:text-base shadow transition"
        >
          + Add new Product
        </button>
      </div>
      {/* Products List */}
      <div className="my-5">
        {/* Desktop Grid */}
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6 min-h-[70vh]">
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <div
                className="bg-white hover:shadow-lg transition rounded-xl h-fit p-4 flex flex-col gap-2 border border-gray-100"
                key={item.id}
              >
                <Link
                  to={`./editProduct/${item.id}`}
                  className="flex flex-col gap-2 cursor-pointer"
                >
                  <div className="flex flex-row items-center mb-2 gap-3">
                    <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url[0]}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded text-gray-400"
                        />
                      ) : (
                        <span className="text-gray-400">No Image</span>
                      )}
                    </div>
                    <div>
                      <p className="text-md font-bold label">{item.name} </p>
                      <p className="font-semibold text-sm label text-pink-500">
                        ₦{parseFloat(item.price).toLocaleString()}
                        <br />
                      </p>
                    </div>
                  </div>
                  <div className="min-h-12">
                    <p className="font-semibold label text-md mb-1">Summary</p>
                    <p className="text-sm text-gray-600">
                      {reduce(item.description)}
                    </p>
                  </div>
                </Link>
                <div
                  className="flex items-center gap-2 mt-2 p-2 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <input
                    id={"stock-" + item.id}
                    type="checkbox"
                    className="accent-pink-500 w-4 h-4"
                    checked={item.stock === 1 ? true : false}
                    onChange={() => handleStockChange(item.id)}
                  />
                  <label
                    htmlFor={"stock-" + item.id}
                    className="text-xs font-medium"
                  >
                    In Stock{" "}
                    <span className="ml-1 font-bold">{item.stock}</span>
                  </label>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex justify-center items-center h-40">
              <p className="text-lg text-gray-600 font-semibold">
                No Products found
              </p>
            </div>
          )}
        </div>
        {/* Mobile Card Layout */}
        <div className="md:hidden flex flex-col gap-4">
          {currentItems.length > 0 ? (
            currentItems.map((item) => (
              <div
                className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 border border-gray-100"
                key={item.id}
              >
                <Link
                  to={`./editProduct/${item.id}`}
                  className="flex flex-row gap-3 items-center cursor-pointer"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center overflow-hidden">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold label">{item.name}</p>
                    <p className="font-semibold text-xs label text-pink-500">
                      ₦{parseFloat(item.price).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 mt-1">
                      {reduce(item.description)}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center gap-2 mt-2 p-2 border border-gray-200 rounded-lg bg-gray-50">
                 <input
                    id={"stock-" + item.id}
                    type="checkbox"
                    className="accent-pink-500 w-4 h-4"
                    checked={item.stock === 1 ? true : false}
                    onChange={() => handleStockChange(item.id)}
                  />
                  <label
                    htmlFor={"stock-mobile-" + item.id}
                    className="text-xs font-medium"
                  >
                    In Stock{" "}
                    <span className="ml-1 font-bold">{item.stock}</span>
                  </label>
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-40">
              <p className="text-lg text-gray-600 font-semibold">
                No Products found
              </p>
            </div>
          )}
        </div>
      </div>
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        className="flex flex-row items-center justify-center space-x-2 mt-5"
        pageClassName="bg-pink-200 hover:bg-pink-500 p-2 rounded-md cursor-pointer"
        previousClassName="bg-pink-200 hover:bg-pink-500 p-2 rounded-md cursor-pointer"
        nextClassName="bg-pink-200 hover:bg-pink-500 p-2 rounded-md cursor-pointer"
        breakClassName="bg-pink-200 hover:bg-pink-500 p-2 rounded-md cursor-pointer"
        activeClassName="bg-pink-500 text-white py-2 px-5 rounded-md cursor-pointer"
        disabledClassName="bg-gray-300 text-gray-500 p-2 rounded-md cursor-not-allowed"
        forcePage={itemsOffset / itemsPerPage}
      />
    </div>
  );
};

export default AdminProducts;
