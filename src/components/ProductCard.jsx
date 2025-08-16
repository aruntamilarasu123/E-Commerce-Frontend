import React from 'react';
import { FaRegStar, FaStar, FaStarHalfAlt, FaHeart, FaRegHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';

const ProductCard = ({ product, hideWishlist = false }) => {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleViewProduct = () => {
    const productId = product._id?.$oid || product._id;
    const role = localStorage.getItem('role') || 'user';
    navigate(`/${role}/${productId}`);
  };

  const toggleWishlist = async (e) => {
    e.stopPropagation();
    if (isInWishlist(product._id)) {
      await removeFromWishlist(product._id);
    } else {
      const status = await addToWishlist(product._id);
      if (status === 'exists') alert('Already in wishlist!');
      else if (status !== 'added') alert('Something went wrong!');
    }
  };

  const renderStars = (value) => {
    const stars = [];
    const full = Math.floor(value || 0);
    const half = (value || 0) % 1 >= 0.5;
    for (let i = 0; i < full; i++) stars.push(<FaStar key={i} className="text-yellow-500" />);
    if (half) stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />);
    while (stars.length < 5) stars.push(<FaRegStar key={`empty-${stars.length}`} className="text-yellow-400" />);
    return stars;
  };

  return (
    <div
      onClick={handleViewProduct}
      className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition cursor-pointer relative flex flex-col overflow-hidden transform hover:-translate-y-1"
    >
      {/* Product Image */}
      <div className="relative w-full h-48 sm:h-56">
        <img
          src={product.images?.[0]?.url || 'https://via.placeholder.com/300x200?text=No+Image'}
          alt={product.name || 'Product'}
          className="w-full h-full object-cover rounded-t-xl"
        />

        {/* Wishlist Button (hidden if hideWishlist = true) */}
        {!hideWishlist && (
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 z-10 bg-white p-1 rounded-full shadow hover:scale-110 transition"
          >
            {isInWishlist(product._id) ? (
              <FaHeart className="text-red-500 text-lg sm:text-xl" />
            ) : (
              <FaRegHeart className="text-gray-400 hover:text-red-500 text-lg sm:text-xl transition" />
            )}
          </button>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-grow p-4 space-y-1 sm:space-y-2">
        <p className="text-xs sm:text-sm text-gray-500 capitalize">{product.category || 'Uncategorized'}</p>
        <h5 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">{product.name || 'Unnamed Product'}</h5>

        {/* Ratings */}
        <div className="flex items-center gap-2 mt-1">
          <span className="flex">{renderStars(product.averageRating)}</span>
          <span className="text-gray-600 text-xs sm:text-sm">({product.numReviews || 0})</span>
        </div>

        {/* Price */}
        <p className="font-semibold text-gray-800 mt-2 text-sm sm:text-base">₹{product.price?.toFixed(2) || '0.00'}</p>
      </div>
    </div>
  );
};

export default ProductCard;
