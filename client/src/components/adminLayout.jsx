import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../context/useAuth";

const AdminLayout = ({ children, active }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const adminLinks = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "All Products", path: "/admin/products" },
    { name: "Order List", path: "/admin/orders" },
  ];
  return (
    <div className="admin-layout flex flex-col md:flex-row h-screen">
      {/* Mobile Hamburger */}
      <button
        className="md:hidden p-4 text-2xl focus:outline-none z-20 absolute top-2 left-2"
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label="Toggle sidebar"
      >
        <span className="block w-8 h-1 bg-gray-700 mb-1 rounded"></span>
        <span className="block w-8 h-1 bg-gray-700 mb-1 rounded"></span>
        <span className="block w-8 h-1 bg-gray-700 rounded"></span>
      </button>
      {/* Sidebar Navigation */}
      <nav
        className={`h-screen overflow-y-hidden fixed md:static top-0 left-0  w-64 bg-gray-100 p-1 shadow-lg flex flex-col justify-between z-10 transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          <h1
            className="text-2xl text-center mt-5 title cursor-pointer"
            onClick={() => navigate("/")}
          >
            SliQue
          </h1>
          <ul className="flex flex-col space-y-1 mt-6">
            {adminLinks.map((link) => (
              <li
                key={link.name}
                className={`w-full flex rounded p-2 cursor-pointer hover:bg-pink-200 ${
                  active == link.name && "bg-pink-200"
                }`}
                onClick={() => {
                  navigate(link.path);
                  setSidebarOpen(false);
                }}
              >
                <span
                  className={`text-gray-700 w-full uppercase font-semibold label text-sm ${
                    active == link.name && "text-black font-semibold"
                  }`}
                >
                  {link.name}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full p-4 bg-gray-200">
          <button
            className="text-red-500 cursor-pointer px-4 py-2 rounded font-bold w-full"
            onClick={logout}
          >
            Logout
          </button>
        </div>
      </nav>
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-0 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      <main className="admin-content flex-1 md:p-6 p-2 bg-white min-h-screen md:ml-0 mt-16 md:mt-0 overflow-y-scroll">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
