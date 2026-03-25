import React, { useEffect, useState } from "react";
import { renderStars } from "../../../Common/functions";
import axios from "axios";
import { Star, ChevronDown } from "lucide-react";

const DescReview = ({ product, id }) => {
  const [activeTab, setActiveTab] = useState("description");
  const [reviews, setReviews] = useState([]);
  const [ratingCount, setRatingCount] = useState(Array(5).fill(0));
  const [error, setError] = useState(null);
  const [newReview, setNewReview] = useState({ 
    rating: 0, 
    title: "",
    body: ""
  });
  const URL = "http://localhost:3000/api";

  const loadReviews = async () => {
    if (!id) return;

    try { 
      const { data } = await axios.get(`${URL}/user/reviews/${id}`, {
        withCredentials: true,
      });

      setReviews(data.reviews);

      const ratingCounts = Array(5).fill(0);
      data.reviews.forEach((review) => {
        if (review.rating >= 1 && review.rating <= 5) {
          ratingCounts[review.rating - 1]++;
        }
      });

      setRatingCount(ratingCounts);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError(error.response?.data?.error || "Failed to fetch reviews");
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
  
    if (newReview.rating === 0) {
      setError("Please select a rating");
      return;
    }
  
    if (!newReview.title.trim()) {
      setError("Please select a review title");
      return;
    }
  
    if (!newReview.body.trim()) {
      setError("Please provide a review description");
      return;
    }
  
    try {
      const { data } = await axios.post(
        `${URL}/user/review/${product._id}`,
        {
          product: id,
          rating: newReview.rating,
          title: newReview.title,
          body: newReview.body,
        },
        { withCredentials: true }
      );
  
      setReviews((prev) => [...prev, data.review]); 
      setNewReview({ rating: 0, title: "", body: "" });
      setError(null);
    } catch (error) {
      console.error("Error adding review:", error);
      setError(error.response?.data?.error || "Failed to add review");
    }
  };
  
  useEffect(() => {
    if (id) loadReviews();
  }, [id]);

  const getReviewTitles = (rating) => {
    const titleSets = {
      1: ["Needs Major Improvement", "Highly Disappointing", "Not Recommended", "Significant Issues", "Far Below Expectations"],
      2: ["Below Expectations", "Some Potential", "Needs Work", "Mostly Unsatisfactory", "Limited Value"],
      3: ["Average Performance", "Meets Basic Needs", "Neutral Experience", "Middle of the Road", "No Strong Feelings"],
      4: ["Very Good Product", "Mostly Satisfied", "Recommended", "Exceeded Expectations", "Strong Performance"],
      5: ["Exceptional!", "Absolutely Amazing", "Best in Class", "Perfect Product", "Highly Recommend"]
    };
    return titleSets[rating] || [];
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Tab Navigation */}
      <div className="border-b border-gray-100 mb-8">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab("description")}
            className={`pb-4 text-sm font-bold uppercase tracking-[0.1em] transition-colors duration-200 ${
              activeTab === "description"
                ? "text-black border-b-2 border-black"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Description
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-4 text-sm font-bold uppercase tracking-[0.1em] transition-colors duration-200 ${
              activeTab === "reviews"
                ? "text-black border-b-2 border-black"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            Reviews ({reviews.length})
          </button>
        </div>
      </div>

      {/* Description Tab */}
      {activeTab === "description" && (
        <div className="py-8">
          <p className="text-[15px] text-gray-500 leading-relaxed max-w-2xl">
            {product.description || "No description available"}
          </p>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === "reviews" && (
        <div className="py-8 space-y-8">
          {/* Rating Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Overall Rating */}
            <div className="md:col-span-1">
              <div className="text-center">
                <div className="text-5xl font-black text-gray-900 mb-2">
                  {product.rating ? (Number.isInteger(product.rating) ? `${product.rating}.0` : product.rating.toFixed(1)) : "N/A"}
                </div>
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.round(product.rating) ? "fill-black text-black" : "text-gray-200"}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-400">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div className="md:col-span-2 space-y-4">
              {ratingCount.slice().reverse().map((count, index) => {
                const starRating = 5 - index;
                const percentage = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
                return (
                  <div key={starRating} className="flex items-center gap-4">
                    <div className="flex items-center gap-1 w-12">
                      {[...Array(starRating)].map((_, i) => (
                        <Star key={i} size={14} className="fill-black text-black" />
                      ))}
                    </div>
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-black transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-8 text-right">{percentage}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
              Customer Reviews
            </h3>
            {reviews.length === 0 ? (
              <p className="text-gray-400 text-sm italic">No reviews yet. Be the first to review!</p>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review._id} className="pb-6 border-b border-gray-100 last:border-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? "fill-black text-black" : "text-gray-200"}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2 text-sm">{review.title}</h4>
                    <p className="text-[13px] text-gray-500 leading-relaxed">{review.body}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Review Form */}
          <div className="pt-8 border-t border-gray-100">
            <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-8">
              Write a Review
            </h3>
            <form onSubmit={handleAddReview} className="max-w-2xl space-y-8">
              {/* Rating Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.15em] text-gray-400 mb-4">
                  Your Rating
                </label>
                <div className="flex gap-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewReview({ ...newReview, rating: star, title: "" })}
                      className={`transition-transform duration-200 hover:scale-110 ${
                        newReview.rating >= star ? "text-black" : "text-gray-300"
                      }`}
                    >
                      <Star size={28} className="fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title Selection */}
              {newReview.rating > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-[0.15em] text-gray-400 mb-4">
                    Select a Title
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {getReviewTitles(newReview.rating).map((title) => (
                      <button
                        key={title}
                        type="button"
                        onClick={() => setNewReview({ ...newReview, title })}
                        className={`py-3 px-4 text-xs font-bold text-center rounded-lg transition-all duration-200 ${
                          newReview.title === title
                            ? "bg-black text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Review Body */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-[0.15em] text-gray-400 mb-3">
                  Your Review
                </label>
                <textarea
                  value={newReview.body}
                  onChange={(e) => setNewReview({ ...newReview, body: e.target.value })}
                  placeholder="Share your detailed experience..."
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
                  rows="5"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!newReview.rating || !newReview.title || !newReview.body}
                className={`w-full py-3 rounded-lg font-bold text-sm transition-all duration-200 ${
                  !newReview.rating || !newReview.title || !newReview.body
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DescReview;