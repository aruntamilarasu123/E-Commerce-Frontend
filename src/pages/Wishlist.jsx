import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { useNavigate } from 'react-router-dom';

const WishList = () => {
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'buyer') {
      navigate('/login'); 
      return;
    }

    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      const res = await axios.get('https://e-commerce-backend-getc.onrender.com/auth/wishlist', config);
      setWishlist(res.data.wishlist || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    try {
      await axios.delete(`https://e-commerce-backend-getc.onrender.com/auth/wishlist/${productId}`, config);
      // update state without refetch
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
    } catch (error) {
      console.error('Error removing from wishlist:', error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="text-gray-500 text-center mt-20">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div key={product._id} className="relative group">
              {/* Product Card */}
              <ProductCard product={product} />

              {/* Remove Button */}
              <button
                onClick={() => handleRemove(product._id)}
                className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-md text-sm font-semibold"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishList;
// testing