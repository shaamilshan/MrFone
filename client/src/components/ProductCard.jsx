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
    <div className="group w-full max-w-sm h-full flex flex-col rounded-2xl overflow-hidden border border-gray-100 bg-white hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-500 cursor-pointer">
      {/* Top section: Product Image Container edge-to-edge */}
      <div className="relative aspect-[4/5] bg-gray-50 flex items-center justify-center flex-shrink-0 overflow-hidden">
        {imageUrl ? (
          <>
            <img
              src={imageUrl}
              alt={title || "Product Image"}
              className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
            />
            {/* Overlay gradient for premium feel */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-sm font-medium">No Image</span>
          </div>
        )}
      </div>

      {/* Bottom section: Details */}
      <div className="p-5 flex flex-col flex-grow bg-white">
        
        {/* Rating and Reviews moved to top */}
        {rating !== undefined && reviewCount !== undefined && (
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < Math.floor(rating || 0)
                      ? "text-black"
                      : "text-gray-200"
                  } fill-current`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-400">
              ({reviewCount})
            </span>
          </div>
        )}

        {/* Product Title */}
        <h3 className="text-[15px] font-extrabold text-gray-900 line-clamp-2 leading-snug group-hover:text-black transition-colors mb-2">
          {title}
        </h3>
        
        {/* Product Description */}
        {description && (
          <p className="text-[13px] text-gray-500 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* This wrapper pushes rating and price to the bottom if the title is short */}
        <div className="mt-auto pt-5 flex flex-col gap-2">
          {/* Pricing */}
          <div className="flex items-baseline gap-x-2">
            <span className="text-[17px] font-black tracking-tight text-black">
              {discountedPrice}
            </span>
            {originalPrice && (
              <span className="text-[13px] font-medium text-gray-400 line-through decoration-gray-300">
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
