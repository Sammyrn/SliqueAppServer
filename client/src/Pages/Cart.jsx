import { useEffect, useState } from "react";
import useAuthStore from "../context/useAuth";
import useCartStore from "../context/useCartStore";
import Loading from "../components/loading";
import { Link, useNavigate } from "react-router-dom";
import { shippingStates } from "../constants/shippingStates";
import { axiosPrivate } from "../config/axios";

const Cart = () => {
  const { cart, getShippingPrice, cartLoading, getCartTotal, removeFromCart } =
    useCartStore();
  const { isAuthenticated, user } = useAuthStore();
  const { updateCartItem, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [shipping, setShipping] = useState("Bayelsa");
  const [shippingPrice, setShippingPrice] = useState(1000);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const addQuantity = async (id) => {
    try {
      const cartItem = cart.find((item) => item.id == id);
      if (cartItem) {
        const newQuantity = cartItem.quantity + 1;
        await updateCartItem(id, newQuantity);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const minusQuantity = async (id) => {
    try {
      const cartItem = cart.find((item) => item.id == id);
      if (cartItem.quantity == 1) {
        await removeFromCart(id);
        return;
      }
      if (cartItem) {
        const newQuantity = cartItem.quantity - 1;
        await updateCartItem(id, newQuantity);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleShippingChange = async (e) => {
    setShipping(e);
    try {
      const result = await getShippingPrice(e);
      setShippingPrice(result);
    } catch (e) {
      console.log("ship price error", e);
    }
  };

  const handleInitializePaystack = async () => {
    if (!isAuthenticated) {
      return navigate("/auth");
    }
    if (cart.length === 0) {
      return alert("Your cart is empty");
    }
    setPaymentLoading(true);
    try {
      const result = await axiosPrivate.post("/paystack/initialize", {
        amount: getCartTotal() + shippingPrice,
        shippingAddress: shipping,
        cart: cart,
      });
      if (result.status === 200 && result.data.authorization_url) {
        // Redirect to Paystack payment page
        window.open(
          result.data.authorization_url,
          "_blank",
          "noopener,noreferrer"
        );
      }
    } catch (error) {
      console.error("Error initializing Paystack:", error);
      alert("Failed to initialize payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  //console.log("cart", cart)
  return (
    <div className="container min-h-[45vh] mx-auto p-5">
      {cartLoading || (paymentLoading && <Loading />)}

      {cart.length === 0 ? (
        <div className="text-center ">
          <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600">Add some products to your cart!</p>
          <button
            onClick={() => navigate("/")}
            className="mt-3 bg-pink-200 cursor-pointer font-semibold py-2 px-4 rounded hover:bg-pink-500"
          >
            View products
          </button>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-3">
          <ul className=" flex flex-col flex-2">
            {cart.map((item) => (
              <div className="flex justify-between items-start bg-white p-4 rounded  border-1 border-gray-200 ">
                  <div className="flex flex-row ">
                    {/*IMAGE*/}
                    <div onClick={() => navigate(`/productDetails/${item.id}`)} className="flex-shrink-0 mr-4 md:h-32w-32 h-15 w-15 bg-gray-200 rounded mb-4">
                      {item.image_url ? (
                        <img
                          src={item.image_url[0]}
                          alt={"img"}
                          className="text-gray-500"
                        />
                      ) : (
                        <div className="md:h-32w-32 h-15 w-15 bg-gray-200 rounded mb-4" />
                      )}
                    </div>
                    <div className="flex flex-col flex-1  justify-between">
                      {/*PRODUCT DATA*/}
                      <div onClick={() => navigate(`/productDetails/${item.id}`)}>
                        <h2 className="font-semibold text-md md:text-2xl">
                          {item.name}
                        </h2>
                        <p className="text-gray-600 mt-1">
                          Price: ₦ {item.price.toLocaleString()}
                        </p>
                      </div>
                      {/*Quantity controls*/}

                      <div className=" bg-gray-100 w-30 p-2 rounded-full flex flex-row gap-1 justify-around">
                        <span
                          className="cursor-pointer flex justify-center items-center flex-1 "
                          onClick={() => minusQuantity(item.id)}
                        >
                          -
                        </span>
                        <span>{item.quantity}</span>
                        <span
                          className="cursor-pointer flex justify-center items-center flex-1 "
                          onClick={() => addQuantity(item.id)}
                        >
                          +
                        </span>
                      </div>
                    </div>
                  </div>
                  {/*DELETE BIN*/}
                  <button
                    className="p-2 cursor-pointer"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <img src="/bin.png" alt="bin" className="object-contain" />
                  </button>
                </div>
            ))}
          </ul>
          <div className="w-1/1 md:w-1/3 flex flex-col gap-5 flex-1">
            <div className="bg-white p-5 rounded border-1 border-gray-200 ">
              <h1 className="text-xl md:text-3xl font-bold mb-4">
                Shipping details
              </h1>

              <p className="text-lg text-gray-600 font-semibold mb-2">
                Select state for delivery:
              </p>
              <select
                className="w-full p-2 border border-gray-300 rounded mb-4"
                value={shipping}
                onChange={(e) => handleShippingChange(e.target.value)}
              >
                {shippingStates.map((state, index) => (
                  <option key={index}>{state}</option>
                ))}
              </select>
            </div>
            <div className="bg-white p-5 rounded border-1 border-gray-200">
              <h1 className="text-xl md:text-3xl font-bold mb-4">
                Order Summary
              </h1>
              <div className="flex flex-row justify-between mb-4 items-center">
                <p className="text-lg text-gray-600 font-semibold mb-2">
                  Total Items:
                </p>
                <p className="text-lg font-semibold mb-2">{cart.length}</p>
              </div>
              <div className="flex flex-row justify-between mb-4 items-center">
                <p className="text-lg text-gray-600 font-semibold mb-2">
                  SubTotal :
                </p>
                <p className="text-lg font-semibold mb-2">
                  ₦ {getCartTotal().toLocaleString()}
                </p>
              </div>
              <div className="flex flex-row justify-between mb-4 items-center">
                <p className="text-lg text-gray-600 font-semibold mb-2">
                  Delivery Fee:
                </p>
                <p className="text-lg font-semibold mb-2">{shippingPrice}</p>
              </div>
              <div className="flex flex-row justify-between mb-4 items-center">
                <p className="text-lg text-gray-600 font-semibold mb-2">
                  Total :
                </p>
                <p className="text-lg font-semibold mb-2">
                  ₦ {getCartTotal() + shippingPrice}
                </p>
              </div>

              <button
                className="mt-3 bg-pink-200 cursor-pointer font-semibold py-2 px-4 rounded hover:bg-pink-500"
                onClick={() => handleInitializePaystack()}
              >
                Proceed to Checkout
              </button>
              {/* <PaystackInline
                style={
                  "mt-1 bg-pink-200 cursor-pointer w-1/1 font-semibold py-2 px-4 rounded hover:bg-pink-500"
                }
                email={user.email || ""}
                amount={getCartTotal()}
                onSuccess={handleCheckOut}
              /> */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
