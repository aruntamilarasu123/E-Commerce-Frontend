import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";
import { useWishlist } from "../context/WishlistContext";
import { MyContext } from "../context/ContextProvider";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; 

const ProductDetails = () => {
  const { role, id } = useParams(); // URL param
  const { cart, setCart } = React.useContext(MyContext);
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [isInCart, setIsInCart] = useState(false);
  const [reviewState, setReviewState] = useState({ rating: 0, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch product by ID
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`https://e-commerce-backend-getc.onrender.com/products/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        data.id = data._id; // normalize id
        setProduct(data);
      } catch (err) {
        console.error("Error fetching product:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  // Cart status
  useEffect(() => {
    if (cart?.items?.length && product) {
      const exists = cart.items.some(
        (item) => (item.product?.id || item.product?._id) === product.id
      );
      setIsInCart(exists);
    } else setIsInCart(false);
  }, [cart, product]);

  const renderStars = (value = 0) => {
    const stars = [];
    const full = Math.floor(value);
    const half = value % 1 >= 0.5;
    for (let i = 0; i < full; i++)
      stars.push(<FaStar key={i} className="text-yellow-500" />);
    if (half) stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />);
    while (stars.length < 5)
      stars.push(
        <FaRegStar key={`empty-${stars.length}`} className="text-yellow-400" />
      );
    return stars;
  };

  const toggleWishlist = async () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      const status = await addToWishlist(product.id);
      if (status === "exists") toast.warning("Already in wishlist!");
      else if (status !== "added") toast.error("Failed to update wishlist.");
    }
  };

  const handleAddToCart = async () => {
    if (!product || isInCart) return;
    try {
      const response = await fetch("https://e-commerce-backend-getc.onrender.com/cart/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      const updatedCart = await fetch("https://e-commerce-backend-getc.onrender.com/cart/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const cartData = await updatedCart.json();
      setCart(cartData);
      toast.success("Product added to cart!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add to cart");
    }
  };

  // ✅ Add / Update Review
  const handleAddReview = async () => {
    if (!product) return;
    try {
      setSubmitting(true);
      const response = await fetch(`https://e-commerce-backend-getc.onrender.com/products/${id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(reviewState),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);

      setProduct((prev) => {
        const userId = localStorage.getItem("userId");

        // Check if this user already has a review
        const existingIndex = prev.reviews.findIndex((r) => r.user === userId);

        let updatedReviews;
        if (existingIndex >= 0) {
          // ✅ Replace existing review
          updatedReviews = [...prev.reviews];
          updatedReviews[existingIndex] = result.review;
        } else {
          // ✅ Add new review
          updatedReviews = [...prev.reviews, result.review];
        }

        return {
          ...prev,
          reviews: updatedReviews,
          numReviews: result.numReviews,
          averageRating: result.averageRating,
        };
      });

      setReviewState({ rating: 0, comment: "" });
      toast.success(result.message);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        Loading product...
      </div>
    );

  if (!product)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-lg">
        Product not found.
      </div>
    );

  const alreadyReviewed = product.reviews?.some(
    (r) => r.user === localStorage.getItem("userId")
  );

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Product Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-white rounded-xl shadow-md overflow-hidden">
        <div>
          <img
            src={
              product.images?.[0]?.url ||
              "https://via.placeholder.com/600x400?text=No+Image"
            }
            alt={product.name}
            className="w-full h-96 object-cover object-center"
          />
        </div>
        <div className="flex flex-col justify-between p-5 space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-gray-700 mt-2">{product.description}</p>
            <p className="text-2xl text-green-700 font-semibold mt-4">
              ₹{product.price}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-yellow-500 flex">
                {renderStars(product.averageRating)}
              </span>
              <span className="text-gray-600 text-sm">
                ({product.numReviews} reviews)
              </span>
            </div>
          </div>
          <button
            onClick={toggleWishlist}
            className="py-2 px-4 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-medium"
          >
            {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
          <button
            onClick={handleAddToCart}
            disabled={isInCart}
            className={`py-2 px-4 rounded-md text-white font-medium ${
              isInCart
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isInCart ? "Added to Cart" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-10 bg-gray-50 p-6 rounded-md shadow">
        <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
        {product.reviews?.length > 0 ? (
          product.reviews.map((review, i) => (
            <div key={i} className="border-b py-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{review.name}</p>
                <span className="flex text-yellow-500">
                  {renderStars(review.rating)}
                </span>
              </div>
              <p className="text-sm text-gray-700 mt-1">{review.comment}</p>
              <p className="text-xs text-gray-400">
                {new Date(review.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet.</p>
        )}
      </section>

      {/* Add / Update Review */}
      <section className="mt-10 p-6 bg-white rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4">
          {alreadyReviewed ? "Update Your Review" : "Write a Review"}
        </h2>
        <div className="flex gap-2 mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onClick={() =>
                setReviewState({ ...reviewState, rating: star })
              }
              className={`text-2xl ${
                reviewState.rating >= star ? "text-yellow-500" : "text-gray-300"
              }`}
            >
              <FaStar />
            </button>
          ))}
        </div>
        <textarea
          className="w-full border rounded p-3 mb-4"
          rows="4"
          placeholder="Write your review here..."
          value={reviewState.comment}
          onChange={(e) =>
            setReviewState({ ...reviewState, comment: e.target.value })
          }
        />
        <button
          disabled={
            submitting || reviewState.rating === 0 || reviewState.comment.trim() === ""
          }
          onClick={handleAddReview}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
        >
          {submitting
            ? "Submitting..."
            : alreadyReviewed
            ? "Update Review"
            : "Submit Review"}
        </button>
      </section>
    </main>
  );
};

export default ProductDetails;
