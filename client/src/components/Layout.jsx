import { useEffect, useState } from "react";

import useAuthStore from "../context/useAuth";
import useCartStore from "../context/useCartStore";

import { Link, useNavigate } from "react-router-dom";
import AuthModal from "./authModal";
import { Icon } from "../assets/Icon";
import { io } from "socket.io-client";
import axios from "axios";

const Layout = ({ heroText, children }) => {
  const { isAuthenticated, openModal, setOpenModal } = useAuthStore();
  const { cart, getCartItems } = useCartStore();
  const { user, logout } = useAuthStore();
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      setOpenModal(false);
      // Fetch cart items for the authenticated user
      getCartItems();
    }
  }, [isAuthenticated]);

  {
    /* socket.io listener for payment success */
  }
  useEffect(() => {
    if (!user) return;
    // Connect to the socket server
    console.log("Connecting to socket server...");
    const socket = io("http://localhost:5050");

    socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    socket.on(`payment-${user.id}`, async (data) => {
      navigate(`/order-result/${data.status}`);
      console.log(data);
      await getCartItems();
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket server");
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to Logout?")) {
      logout();
    }
  };

  return (
    <div className="overflow-x-hidden app">
      {/* sliding text animation */}
      <div className="w-screen overflow-hidden bg-black text-white">
        <div className="animate-slide whitespace-nowrap py-1">
          <span className="mx-5">
            Welcome to Slique - Your Style Destination!
          </span>
          <span className="mx-5">Discover the Latest Trends in Makeup!</span>
          <span className="mx-5">Unleash Your Inner Beauty with Slique!</span>
          <span className="mx-5">Shop Now for Exclusive Offers!</span>
          <span className="mx-5">Join the Slique Community Today!</span>
        </div>
      </div>
      {/* Button to test api */}
      {/* <button onClick={handleTest} className="bg-black align-center text-xl text-white p-3">SEND REQUEST</button> */}
      <header className="flex flex-col items-center justify-center border-b-2 border-gray-200 bg-white">
        <div className="container py-5 mx-auto flex justify-between items-center px-4">
          <Link to={"/"} className="flex items-center space-x-3">
            <h1 className="text-xl md:text-3xl font-bold title">SQ</h1>
            <h1 className="text-xl md:text-2xl font-md">Slique</h1>
          </Link>
          <div className="flex flex-row items-center md:space-x-3 space-x-1">
            <div
              onClick={() => setShowSearch(!showSearch)}
              className="flex gap-3 bg-trasparent  py-2 md:px-5 px-3 rounded-full border-0 md:border-2 border-gray-400 "
            >
              <Icon name={"search"} color={"black"} />
              <input
                type="text"
                placeholder="Seach for products..."
                onChange={(e) => navigate(`/search?q=${e.target.value}`)}
                className="hidden md:block  text-sm text-gray-800 placeholder-gray-400"
              />
            </div>
            <p className="text-sm hidden md:block mr-5">
              {user && "Welcome, " + user.fullname}
            </p>

            <button
              className="relative cursor-pointer"
              onClick={() => navigate("/cart")}
            >
              <span className="absolute bg-pink-200 rounded-4xl flex justify-center items-center w-[16px] h-[16px] font-bold text-[13px] -bottom-3/12 -right-1/3">
                {cart.length}
              </span>
              <Icon name="cart" color={"black"} />
            </button>

            <button
              onClick={() =>
                !isAuthenticated ? setOpenModal(!openModal) : handleLogout()
              }
              className="text-red-500 font-bold py-1 px-3 cursor-pointer rounded md:text-md text-sm "
            >
              <Icon name="user" color={"black"} />
            </button>
            {user?.role === "2004" && (
              <Link to={"/admin/dashboard"}>Dashboard</Link>
            )}
          </div>
        </div>
        {/*Mobile search input*/}
        <div
          className={`absolute lg:opacity-0 -z-5 top-27 right-0 flex flex-row gap-3 bg-white opacity-0 w-1/1 px-5 py-2 border-2 border-gray-200 ${
            showSearch && "top-20 opacity-100 z-1"
          }`}
        >
          <input
            type="text"
            placeholder="Seach for products..."
            onChange={(e) => navigate(`/search?q=${e.target.value}`)}
            className="w-full  text-sm text-gray-800 placeholder-gray-400"
          />
          <div onClick={() => setShowSearch(false)}>
            <Icon name={"cancel"} />
          </div>
        </div>
        {heroText !== "No Hero Text" && (
          <div className="w-screen px-2 md:px-15  min-h-[40vh] border-y-2 border-gray-200 flex items-center justify-center bg-pink-200">
            {heroText ? (
              <h1 className="text-center text-5xl title">{heroText}</h1>
            ) : (
              <div className="flex max-md:h-[90vh] max-md:flex-col flex-row items-center justify-between w-6/7 min-h-[50vh]">
                <div className="flex-1/1 flex items-center">
                  <h1 className="text-5xl title px-5">
                    Welcome to Slique! Your one-stop shop for stylish makeup.
                  </h1>
                </div>
                <div className=" h-1/1">
                  <img
                    src="/hero.png"
                    alt="hero"
                    className="object-cover h-1/1"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </header>
      {openModal && (
        <div>
          <div
            onClick={() => setOpenModal(false)}
            className="fixed top-0 z-10 h-[100vh] w-[100vw]"
          ></div>
          <AuthModal setOpenModal={setOpenModal} />
        </div>
      )}

      <main className="pb-10 min-h-[70vh] container mx-auto">{children}</main>
      <footer className=" bg-black text-white flex flex-col  pt-10 px-10 justify-between">
        <div className=" container mx-auto flex flex-col-reverse space-x-1  justify-between py-3 gap-5 md:flex-row">
          <div className="flex-1">
            <h3 className="text-xl font-bold">About Us</h3>
            <ul className="">
              <li className="title text-lg">SliQue</li>
              <li className="">+234-789-222-31</li>
              <li className="">Affiliates</li>
              <li className="">No 24. Tnama Rd Beside Plaza</li>
            </ul>
          </div>

          <div className="flex-2">
{/*             
            <div className="">
              <h3 className="text-lg">Subscribe to our newsletter</h3>
              <div className="">
                <input
                  type="input"
                  placeholder="your@email.com"
                  className="text-xl w-full bg-white rounded-xl text-black p-3"
                />
                <button className="bg-gray-800 px-2 py-1 my-2 rounded cursor-pointer hover:bg-pink-500">
                  Join!
                </button>
              </div>
            </div>
             */}
            <div className="footerRightMenu">
              <h3 className="fMenuTitle mb-3">Follow Us</h3>
              <div className="fIcons flex flex-row gap-5">
                <Icon name={'whatsapp'} />
                <Icon name={'instagram'} />

              </div>
            </div>
          </div>
        </div>
        <div className="border-t-1 border-gray-400 py-3 flex justify-center">
          <span className="text-gray-400 text-center">
            @Sammy.rn . All rights reserved. 2024.
          </span>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
