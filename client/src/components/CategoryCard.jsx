import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ 
  title, 
  imageUrl, 
  linkTo = "#" 
}) => {
  return (
    <Link 
      to={linkTo}
      className="group relative block w-full aspect-[4/5] sm:aspect-square md:aspect-[4/3] max-h-[400px] rounded-2xl md:rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* Background Image */}
      {imageUrl ? (
        <img 
          src={imageUrl} 
          alt={title || "Category Option"} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-slate-200 flex items-center justify-center">
          <span className="text-slate-400 text-sm">No Image</span>
        </div>
      )}

      {/* Dark Gradient Overlay for optimal text readability */}
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>

      {/* Centered Title */}
      <div className="absolute inset-0 flex items-center justify-center p-6 text-center">
        <h3 className="text-white text-3xl sm:text-4xl font-bold tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)] transition-transform duration-300 group-hover:-translate-y-1">
          {title}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
