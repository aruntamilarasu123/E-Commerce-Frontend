import { Routes, Route, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { MyContext } from './context/ContextProvider';

import Home from './pages/Home';
import Signup from './pages/SignUp';
import Login from './pages/Login';
import SellerDashboard from './pages/SellerDashboard';
import BuyerDashboard from './pages/BuyerDashboard';
import ProductDetails from './components/ProductDetails';
import ProductCard from './components/ProductCard';
import ReuseNavbar from './components/ReuseNavbar';
import ProductCart from './pages/ProductCart';
import PlaceOrder from './pages/PlaceOrder';
import BuyerOrders from './pages/BuyerOrders';
import SellerOrders from './pages/SellerOrders';
import ChangePassword from './components/ChangePassword';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import UserProfile from './pages/UserProfile';
import SalesReport from './pages/SalesReport';
import Footer from './components/Footer';
import WishList from './pages/WishList';

function App() {
  const location = useLocation();

  // Routes where navbar/footer should be hidden
  const hiddenRoutes = [
    '/login',
    '/signup',
    '/forgot-password',
    '/change-password'
  ];

  const showNavbar =
    !hiddenRoutes.includes(location.pathname) &&
    !location.pathname.startsWith('/reset-password');

  const showFooter =
    !hiddenRoutes.includes(location.pathname) &&
    !location.pathname.startsWith('/reset-password');

  return (
    <div>
      {showNavbar && <ReuseNavbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/:role/change-password" element={<ChangePassword />} />

        {/* Buyer routes */}
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/buyer/user-profile" element={<UserProfile />} />
        <Route path="/buyer/cart" element={<ProductCart />} />
        <Route path="/buyer/placeorder" element={<PlaceOrder />} />
        <Route path="/buyer/order" element={<BuyerOrders />} />
        <Route path="/buyer/wishlist" element={<WishList />} />
        <Route path="/:role/:id" element={<ProductDetails />} />

        {/* Seller routes */}
        <Route path="/seller" element={<SellerDashboard />} />
        <Route path="/seller/user-profile" element={<UserProfile />} />
        <Route path="/seller/order" element={<SellerOrders />} />
        <Route path="/seller/sales-report" element={<SalesReport />} />
      </Routes>

      {showFooter && <Footer />}
    </div>
  );
}

// Optional: component to show multiple ProductCards
function proDetail() {
  const { data } = useContext(MyContext);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 p-4">
      {data.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}

export default App;
export { proDetail };
