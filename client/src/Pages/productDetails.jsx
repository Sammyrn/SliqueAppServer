import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../components/loading";
import useProductStore from "../context/useProductStore";
import useCartStore from "../context/useCartStore";
import useAuthStore from "../context/useAuth";
import ProductCard from "../components/productCard";
import { Icon } from "../assets/Icon";

const ProductDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const { getProductById, products } = useProductStore();
  const { isAuthenticated } = useAuthStore();
  const [data, setData] = useState({
    name: "",
    price: "",
    image: [],
    description: "",
  });
  const [displayImg, setDisplayImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, cart, updateCartItem } = useCartStore();
  const navigate = useNavigate();

  //Add to cart function - updates the cart if item already in cart
  const handleCart = async (id) => {
    if (!isAuthenticated) {
      return navigate("/auth");
    }
    try {
      const cartItem = cart.find((item) => item.id == id);
      if (cartItem) {
        const newQuantity = cartItem.quantity + quantity;
        await updateCartItem(id, newQuantity).then(() => {
          alert(`Product ${cartItem.name} updated to cart`);
        });
        return;
      }

      await addToCart(id, quantity).then(() => {
        alert(`Product ${id} added to cart`);
      });
    } catch (error) {
      console.error("Error adding product to cart:", error);
      alert("Failed to add product to cart");
    }
  };

  const getProduct = async () => {
    try {
      const res = await getProductById(id);
      setData({
        name: res.name,
        price: res.price,
        image: JSON.parse(res.image_url),
        description: res.description,
      });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProduct();
  }, [id]);

  const handleQuantity = (operator) => {
    if (operator === "+") {
      setQuantity((prev) => prev + 1);
    } else if (operator === "-") {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 0));
    }
  };

  //Create new array to map as 'Products you may like'
  const isFeaturedProducts = products;

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 pb-8">
        {/* Product Details Section */}
        <div className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 p-6 lg:p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                {data.image && data.image.length > 0 && (
                  <img
                    src={data.image[displayImg]}
                    alt={data.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>

              {/* Thumbnail Images */}
              {data.image && data.image.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {data.image.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setDisplayImg(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        displayImg === idx
                          ? "border-pink-500 shadow-md"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${data.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6 lg:ml-5">
              {/* Product Title */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  {data.name}
                </h1>
                <div className="text-2xl lg:text-3xl font-bold text-pink-600">
                  ₦{parseInt(data.price).toLocaleString()}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 ">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {data.description}
                </p>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  Quantity
                </h3>
                <div className="flex items-center space-x-4">
                  <div className=" bg-gray-100 w-50 p-2 rounded-full flex flex-row gap-1 justify-around">
                    <button
                      onClick={() => handleQuantity("-")}
                      className="cursor-pointer flex justify-center items-center flex-1 "
                      disabled={quantity <= 1}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span className="px-6 py-2 text-lg font-semibold text-gray-900 min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantity("+")}
                      className="cursor-pointer flex justify-center items-center flex-1 "
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Cart Button */}
              <div className="pt-4">
                <button
                  onClick={() => handleCart(id)}
                  className="w-full bg-pink-200 font-semibold py-4 px-6 cursor-pointer hover:bg-pink-500 rounded"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Icon name="cart" color="black" />
                    <span>Add to Cart</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-3xl font-bold text-gray-900 mb-2">
              You May Also Like
            </h2>
            <p className="text-gray-600">Discover more amazing products</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {isFeaturedProducts.map((product) => (
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
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
