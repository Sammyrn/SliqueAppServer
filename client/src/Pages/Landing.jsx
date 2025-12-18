import { useEffect, useState } from "react";
import useProductStore from "../context/useProductStore";
import useCartStore from "../context/useCartStore";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../context/useAuth";
import ProductCard from "../components/productCard";
import ReactPaginate from "react-paginate";
import { axiosPrivate } from "../config/axios";

const Landing = () => {
  const { products, loading } = useProductStore();
  const { addToCart, cart, updateCartItem } = useCartStore();
  const navigator = useNavigate();
  const { isAuthenticated } = useAuthStore();
  // Pagination state
  const [productOffset, setProductOffset] = useState(0);

  //Add to cart function - updates the cart if item already in cart
  const handleCart = async (id) => {
    if (!isAuthenticated) {
      navigator("/auth");
      return;
    }
    try {
      const cartItem = cart.find((item) => item.id == id);
      if (cartItem) {
        const newQuantity = cartItem.quantity + 1;
        await updateCartItem(id, newQuantity).then(() => {
          alert(`Product ${cartItem.name} updated to cart`);
        });
        return;
      }

      await addToCart(id, 1).then(() => {
        alert(`Product ${id} added to cart`);
      });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart");
    }
  };

  const productsPerPage = 8; // Number of products per page

  const endOffset = productOffset + productsPerPage;
  const pageCount = Math.ceil(products.length / productsPerPage);
  const currentItems = products.slice(productOffset, endOffset);
  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * productsPerPage) % products.length;
    console.log(event, newOffset, products.length);

    setProductOffset(newOffset);
  };

  // console.log(products)

  return (
    <section className="flex flex-col items-center my-10">
      <h1 className="text-2xl title">Products</h1>

      {!currentItems ? (
        <div className="flex flex-col gap-3">
          <p>No products available</p>
        </div>
      ) : loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 my-3">
          {/*<!--Add products here-->*/}
          {currentItems.length > 0 &&
            currentItems.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image_url}
                name={product.name}
                price={product.price}
                onAddToCart={() => handleCart(product.id)}
              />
            ))}
        </div>
      )}

      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
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
        forcePage={productOffset / productsPerPage}
      />
    </section>
  );
};

export default Landing;
