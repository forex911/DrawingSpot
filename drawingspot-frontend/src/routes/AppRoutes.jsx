import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Home from "../pages/Home";
import Pricing from "../pages/Pricing";
import Gallery from "../pages/Gallery";
import Order from "../pages/Order";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import { useAuth } from "../context/AuthContext";
import CartDrawer from "../components/common/CartDrawer";
import UserChat from "../components/common/UserChat";
import HowItWorks from "../pages/HowItWorks";
import ArtBuyingGuide from "../pages/ArtBuyingGuide";
import FAQs from "../pages/FAQs";
import ContactUs from "../pages/ContactUs";
import ShippingPolicy from "../pages/ShippingPolicy";
import AdminPanel from "../pages/AdminPanel";
import MyOrders from "../pages/MyOrders";

function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}
function AppRoutes() {
  const { isAuthenticated, userId } = useAuth();

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID ?? ""}>
      <BrowserRouter>
        <ScrollToTop />
        <CartDrawer />
        {/* Global floating chat popup — temporarily disabled
        {isAuthenticated && userId && (
          <UserChat conversationUserId={userId} />
        )}
        */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/order" element={<Order />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/art-buying-guide" element={<ArtBuyingGuide />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          {/* Protected Route */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? <Dashboard /> : <Login />
            }
          />
          {/* Admin Route */}
          <Route
            path="/admin"
            element={isAuthenticated ? <AdminPanel /> : <Login />}
          />
          {/* My Orders */}
          <Route
            path="/my-orders"
            element={isAuthenticated ? <MyOrders /> : <Login />}
          />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default AppRoutes;
