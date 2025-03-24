import React, { useEffect, useState } from "react";
import { renderStars } from "../../../Common/functions";
import axios from "axios";
import { URL } from "../../../Common/api";

const ProductDescriptionReview = ({ product, id }) => {
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [ratingCount, setRatingCount] = useState([]);
  const [error, setError] = useState(null);
  
  // New state for adding reviews
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: '',
    username: ''
  });

  const loadReviews = async () => {
    try {
      const { data } = await axios.get(`${URL}/user/reviews/${id}`, {
        withCredentials: true,
      });
      setReviews(data.reviews);
      const ratingCounts = Array(5).fill(0);

      data.reviews.forEach((review) => {
        const rating = review.rating;
        ratingCounts[rating - 1]++;
      });

      setRatingCount(ratingCounts);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${URL}/user/reviews/${id}`, newReview, {
        withCredentials: true,
      });
      
      // Add the new review to the existing reviews
      setReviews([...reviews, response.data.review]);
      
      // Reset the form
      setNewReview({
        rating: 0,
        comment: '',
        username: ''
      });

      // Reload reviews to update rating counts
      loadReviews();
    } catch (error) {
      console.error("Error adding review", error);
      setError(error.response?.data?.error || "Failed to add review");
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  return (
    <div className="mt-5 ">
      <div className="flex justify-center border-b">
        <button
          className={`py-3 px-4 text-sm uppercase ${
            activeTab === 'description' 
              ? 'border-b-2 border-red-500 text-red-500 font-semibold' 
              : 'text-gray-500'
          }`}
          onClick={() => setActiveTab('description')}
        >
          Description
        </button>
        <button
          className={`py-3 px-4 text-sm uppercase ${
            activeTab === 'reviews' 
              ? 'border-b-2 border-red-500 text-red-500 font-semibold' 
              : 'text-gray-500'
          }`}
          // onClick={() => setActiveTab('reviews')}
        >
          Reviews ({product.numberOfReviews})
        </button>
      </div>

      {activeTab === 'description' && (
        <div className="p-5">
          <p className="text-gray-600">{product.description}</p>
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="p-5">
          {error && <p className="text-red-500">{error}</p>}
          
          <div className="flex gap-8">
            <div className="bg-gray-100 p-6 text-center rounded-lg">
              <h2 className="text-4xl font-bold">
                {Number.isInteger(product.rating)
                  ? `${product.rating}.0`
                  : product.rating.toFixed(1)}
              </h2>
              <div className="flex justify-center my-2">
                {renderStars(product.rating)}
              </div>
              <p className="text-gray-600">
                Based on {product.numberOfReviews} reviews
              </p>
            </div>

            <div className="flex-grow">
              {ratingCount && ratingCount.slice().reverse().map((count, index) => {
                const starRating = 5 - index;
                const percentage = parseInt((count / product.numberOfReviews) * 100);
                
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

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
            {reviews.map(review => (
              <div key={review._id} className="border-b py-4">
                <div className="flex items-center mb-2">
                  {renderStars(review.rating)}
                  <span className="ml-2 text-gray-600 text-sm">
                    {review.date}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  By {review.username}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Add a Review</h3>
            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block mb-2">Rating</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`text-2xl mr-1 ${
                        newReview.rating >= star 
                          ? 'text-yellow-500' 
                          : 'text-gray-300'
                      }`}
                      onClick={() => setNewReview({...newReview, rating: star})}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block mb-2">Username</label>
                <input
                  type="text"
                  value={newReview.username}
                  onChange={(e) => setNewReview({...newReview, username: e.target.value})}
                  className="w-full border p-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-2">Comment</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                  className="w-full border p-2 rounded"
                  rows="4"
                  required
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
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

export default ProductDescriptionReview;