import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useProductStore from "../context/useProductStore";
import ProductCard from "../components/productCard";
import useCartStore from "../context/useCartStore";

const SearchResults = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, cart, updateCartItem } = useCartStore();

  const { products } = useProductStore();

  // get search query from URL
  const q = new URLSearchParams(window.location.search).get("q");

  //filter products in store for search results
  const searchProduct = () => {
    const searchLowerCase = query.toLowerCase();
    const searchResult = products.filter((itm) =>
      itm.name.toLowerCase().includes(searchLowerCase)
    );
    setResults(searchResult);
  };
  useEffect(() => {
    if (q) {
      setQuery(q);
      // Call the function to get search results
      //getSearchResults(q);
      searchProduct();
      setLoading(false);
      return;
    }

    navigate("/");
  }, [q]);

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

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-semibold py-3">
        Showing results for "{query}"
      </h2>
      {/*<!--Add products here-->*/}
      <div className="flex flex-row gap-5">
        {results.length > 0 ? (
          results.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              image={product.image_url}
              name={product.name}
              price={product.price}
              onAddToCart={() => handleCart(product.id)}
            />
          ))
        ) : loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="flex flex-col gap-3">
            <p>No products available</p>
            <Link className="p-3 bg-pink-200 hover:bg-pink-500" to={"/"}>
              Go see Collections
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
