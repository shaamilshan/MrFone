import React, { useEffect, useState } from "react";
import { renderStars } from "../../../Common/functions";
import axios from "axios";

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

console.log(reviews)
  const URL = "http://localhost:3000/api";

  // Predefined review titles based on rating
  const getReviewTitles = (rating) => {
    const titleSets = {
      1: [
        "Needs Major Improvement",
        "Highly Disappointing",
        "Not Recommended",
        "Significant Issues",
        "Far Below Expectations"
      ],
      2: [
        "Below Expectations",
        "Some Potential",
        "Needs Work",
        "Mostly Unsatisfactory",
        "Limited Value"
      ],
      3: [
        "Average Performance",
        "Meets Basic Needs",
        "Neutral Experience",
        "Middle of the Road",
        "No Strong Feelings"
      ],
      4: [
        "Very Good Product",
        "Mostly Satisfied",
        "Recommended",
        "Exceeded Expectations",
        "Strong Performance"
      ],
      5: [
        "Exceptional!",
        "Absolutely Amazing",
        "Best in Class",
        "Perfect Product",
        "Highly Recommend"
      ]
    };

    return titleSets[rating] || [];
  };

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

    // Validate inputs
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
          order:product._id,
          rating: newReview.rating,
          title: newReview.title,
          body: newReview.body,
        },
        { withCredentials: true }
      );

      // Add the new review to the list
      setReviews((prev) => [...prev, data.review]); 
      
      // Reset form
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

  return (
    <div className="mt-5 bg-white shadow-lg rounded-lg  overflow-hidden">
      {/* Tabs Section */}
      <div className="flex justify-center border-b">
        <button
          className={`py-3 px-4 text-sm uppercase transition-colors duration-300 ${
            activeTab === 'description' 
              ? 'border-b-2 border-red-500 text-red-500 font-semibold' 
              : 'text-gray-500 hover:text-red-300'
          }`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </button>
        <button
          className={`py-3 px-4 text-sm uppercase transition-colors duration-300 ${
            activeTab === 'reviews' 
              ? 'border-b-2 border-red-500 text-red-500 font-semibold' 
              : 'text-gray-500 hover:text-red-300'
          }`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews 
          {/* ({product.numberOfReviews || 0}) */}
        </button>
      </div>

      {/* Description Tab */}
      {activeTab === 'description' && (
        <div className="p-5">
          <p className="text-gray-600">{product.description}</p>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="p-5">
          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              {error}
            </div>
          )}
          
          {/* Rating Overview */}
          <div className="flex flex-col md:flex-row gap-8 mb-6">
            <div className="bg-gray-100 p-6 text-center rounded-lg md:w-1/3">
              <h2 className="text-4xl font-bold">
                {product.rating ? 
                  (Number.isInteger(product.rating) 
                    ? `${product.rating}.0` 
                    : product.rating.toFixed(1)) 
                  : "N/A"}
              </h2>

              <div className="flex justify-center my-2">
                {renderStars(product.rating)}
              </div>
              <p className="text-gray-600">
                Based on Reviews
                {/* {product.numberOfReviews || 0} */}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="flex-grow">
              {ratingCount && ratingCount.slice().reverse().map((count, index) => {
                const starRating = 5 - index;
                const percentage = product.numberOfReviews 
                  ? parseInt((count / product.numberOfReviews) * 100)
                  : 0;
                
                return (
                  <div key={starRating} className="flex items-center mb-2">
                    <div className="flex mr-3">
                      {renderStars(starRating)}
                    </div>
                    <div className="flex-grow bg-gray-200 rounded-full h-2 mr-3">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {percentage}% ({count})
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Existing Reviews */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
            {reviews.length === 0 ? (
              <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map(review => (
                <div key={review._id} className="border-b py-4 hover:bg-gray-50 px-2   transition-colors duration-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-gray-600 text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-1">{review.title}</h4>
                  <p className="text-gray-700">{review.body}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Review Form */}
          {reviews.length > 0 ? (
  <div className="mt-6 bg-gray-50 p-5 rounded-lg text-center text-gray-700">
    <p>You have already reviewed this product. Thank you! 🙌</p>
  </div>
) : (
  <div className="mt-6 bg-gray-50 p-5 rounded-lg">
    <h3 className="text-lg font-semibold mb-4">Add a Review</h3>
    <form onSubmit={handleAddReview} className="space-y-4">
      {/* Rating Selection */}
      <div>
        <label className="block mb-2 text-gray-700">Your Rating</label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className={`text-3xl mr-1 transition-colors duration-300 ${
                newReview.rating >= star
                  ? "text-yellow-500"
                  : "text-gray-300 hover:text-yellow-300"
              }`}
              onClick={() =>
                setNewReview({ ...newReview, rating: star, title: "" })
              }
            >
              ★
            </button>
          ))}
        </div>
      </div>

      {/* Title Selection */}
      {newReview.rating > 0 && (
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">
            Select a Review Title
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {getReviewTitles(newReview.rating).map((title) => (
              <button
                key={title}
                type="button"
                className={`py-2 px-3 border rounded-lg text-sm transition-colors duration-300 ${
                  newReview.title === title
                    ? "bg-red-500 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setNewReview({ ...newReview, title })}
              >
                {title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Review Body */}
      <div>
        <label className="block mb-2 text-gray-700">Your Review</label>
        <textarea
          value={newReview.body}
          onChange={(e) =>
            setNewReview({ ...newReview, body: e.target.value })
          }
          className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          rows="4"
          placeholder="Share your detailed experience..."
          required
        ></textarea>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center justify-center"
        disabled={!newReview.rating || !newReview.title}
      >
        Submit Review
      </button>
    </form>
  </div>
)}

        </div>
      )}
    </div>
  );
};

export default DescReview;