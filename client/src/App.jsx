import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductDetails from "./Pages/productDetails";
import Landing from "./Pages/Landing";
import Layout from "./components/Layout";
import ForbiddenScreen from "./Pages/forbidden";
import Cart from "./Pages/Cart";
import PrivateRoute from "./components/privateRoute";
import Dashboard from "./Pages/Dashboard";
import AuthModal from "./components/authModal";
import AdminLayout from "./components/adminLayout";
import useAuthStore from "./context/useAuth";
import AdminProducts from "./Pages/adminProducts";
import AdminOrders from "./Pages/adminOrders";
import AddNewProduct from "./Pages/addNewProduct";
import Loading from "./components/loading";
import EditProduct from "./Pages/EditProduct";
import SearchResults from "./Pages/searchResults";
import useProductStore from "./context/useProductStore";
import OrderResult from "./Pages/OrderResult";

function App() {
  const [loading, setLoading] = useState(true);
  const { authCheck } = useAuthStore();
  const { getProduct } = useProductStore();

  {
    /*APP AUTH CHECK AND GET PRODUCTS*/
  }
  useEffect(() => {
    getProduct();
    authCheck()
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error during authentication check:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <Router>
      <Routes>
        {/*PUBLIC ROUTES */}
        <Route
          path="/"
          element={
            <Layout>
              <Landing />
            </Layout>
          }
        />
        <Route
          path="/productDetails/:id"
          element={
            <Layout heroText={"No Hero Text"}>
              <ProductDetails />
            </Layout>
          }
        />
        <Route
          path="/search"
          element={
            <Layout heroText={"No Hero Text"}>
              <SearchResults />
            </Layout>
          }
        />
        <Route
          path="/cart"
          element={
            <Layout heroText={"Your Shopping Cart"}>
              <Cart />
            </Layout>
          }
        />
        <Route path="/auth" element={<AuthModal />} />
        <Route path="/order-result/:status" element={<OrderResult />} />

        <Route path="/forbidden" element={<ForbiddenScreen />} />

        {/*PRIVATE ROUTES */}
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminLayout active={"Dashboard"}>
                <Dashboard />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <PrivateRoute>
              <AdminLayout active={"All Products"}>
                <AdminProducts />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/products/addNewProduct"
          element={
            <PrivateRoute>
              <AdminLayout active={"All Products"}>
                <AddNewProduct />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/products/editProduct/:id"
          element={
            <PrivateRoute>
              <AdminLayout active={"All Products"}>
                <EditProduct />
              </AdminLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <PrivateRoute>
              <AdminLayout active={"Order List"}>
                <AdminOrders />
              </AdminLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
