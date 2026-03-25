import React from 'react';

const ProductCard = ({
  imageUrl,
  title,
  description,
  rating,
  reviewCount,
  discountedPrice,
  originalPrice,
}) => {
  return (
    <div className="w-full max-w-sm h-full flex flex-col rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Top section: Product Image Container (Increased height as requested) */}
      <div className="relative w-full h-80 sm:h-96 bg-slate-50 p-6 flex items-center justify-center flex-shrink-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title || "Product Image"}
            className="w-full h-full object-contain drop-shadow-md mix-blend-multiply"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            {/* Fallback image placeholder if no imageUrl is passed */}
            <span className="text-sm">No Image Provided</span>
          </div>
        )}
      </div>

      {/* Bottom section: Details */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow bg-white">
        {/* Product Title */}
        <h3 className="text-lg sm:text-xl font-semibold text-slate-800 line-clamp-2 leading-snug mb-1 hover:text-blue-600 transition-colors cursor-pointer">
          {title}
        </h3>
        
        {/* Product Description */}
        {description && (
          <p className="text-sm text-slate-500 line-clamp-2 mb-3">
            {description}
          </p>
        )}

        {/* This wrapper pushes rating and price to the bottom if the title is short */}
        <div className="mt-auto flex flex-col gap-2">
          
          {/* Rating and Reviews */}
          {rating !== undefined && reviewCount !== undefined && (
            <div className="flex items-center gap-2">
              <div className="flex items-center space-x-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(rating || 0)
                        ? "fill-current"
                        : "text-slate-200 fill-current"
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium text-slate-500">
                {reviewCount} review{reviewCount !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {/* Pricing */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1">
            <span className="text-2xl font-bold text-slate-900">
              {discountedPrice}
            </span>
            {originalPrice && (
              <span className="text-base font-medium text-slate-400 line-through decoration-slate-400/70">
                {originalPrice}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
