import { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

export const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Run only if token exists AND role is buyer
    if (!token || role !== 'buyer') return;

    try {
      const res = await axios.get('https://e-commerce-backend-getc.onrender.com/auth/wishlist', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWishlist(res.data.wishlist || []);
    } catch (err) {
      console.error('Failed to fetch wishlist', err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const addToWishlist = async (productId) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'buyer') return 'unauthorized';

    try {
      await axios.post(
        'https://e-commerce-backend-getc.onrender.com/auth/wishlist',
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchWishlist();
      return 'added';
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      if (msg === 'Product already in wishlist') return 'exists';
      console.error(msg);
      return 'error';
    }
  };

  const removeFromWishlist = async (productId) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'buyer') return;

    try {
      await axios.delete(`https://e-commerce-backend-getc.onrender.com/auth/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchWishlist();
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
    }
  };

  const isInWishlist = (productId) => wishlist.some((item) => item._id === productId);

  return (
    <WishlistContext.Provider
      value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
