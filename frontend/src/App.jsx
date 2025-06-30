import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import SearchResults from "./pages/SearchResults";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import AdminLayout from "./components/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import ProductTable from "./pages/ProductTable";
import ProductForm from "./components/ProductForm";
import NotFound from "./pages/NotFound";

const AppRoutes = () => {
  const location = useLocation();

  const isAdminPath = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminPath && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/shop/:category" element={<Shop />} />
        <Route path="/product/:slugId" element={<ProductDetails />} />
        <Route path="/search" element={<SearchResults />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<ProductTable />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
