import { URL } from "@/Common/api";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProductSlider = ({ images = [], selectedImageIndex = 0, imgUrl, onSelectImage }) => {
  const [currentIndex, setCurrentIndex] = useState(selectedImageIndex);
  const [direction, setDirection] = useState(0);

  // Helper to normalize image source: accept full URLs, data URIs or filename keys (which are prefixed with URL/img/)
  const getImageSrc = (img) => {
    if (!img) return "";
    if (img.startsWith("http") || img.startsWith("data:") || img.startsWith("/")) return img;
    return `${URL}/img/${img}`;
  };

  const prevSlide = () => {
    setDirection(-1);
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    onSelectImage?.(newIndex);
  };

  const nextSlide = () => {
    setDirection(1);
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    onSelectImage?.(newIndex);
  };

  const goToSlide = (slideIndex) => {
    setDirection(slideIndex > currentIndex ? 1 : -1);
    setCurrentIndex(slideIndex);
    onSelectImage?.(slideIndex);
  };

  React.useEffect(() => {
    setCurrentIndex(selectedImageIndex);
  }, [selectedImageIndex]);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-full min-h-[400px] lg:min-h-[650px] bg-gray-100 rounded-2xl flex items-center justify-center">
        <span className="text-gray-400 text-sm">No images available</span>
      </div>
    );
  }

  const imageSrc = getImageSrc(images[currentIndex]);

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      zIndex: 0,
      x: dir > 0 ? -100 : 100,
      opacity: 0,
    }),
  };

  return (
    <div className="w-full space-y-4">
      {/* Main Image Container with Animation */}
      <div className="w-full h-full relative group overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            style={{
              backgroundImage: `url('${imageSrc}')`,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
            className="absolute inset-0 w-full h-full min-h-[400px] lg:min-h-[650px] bg-gray-50 rounded-lg"
          />
        </AnimatePresence>

        {/* Placeholder to maintain height */}
        <div className="w-full min-h-[400px] lg:min-h-[650px] rounded-lg" />

        {/* Left Arrow */}
        {images.length > 1 && (
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-black shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 active:scale-90"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Right Arrow */}
        {images.length > 1 && (
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-black shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100 active:scale-90"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Dot Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, slideIndex) => (
              <button
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
                className={`transition-all duration-300 rounded-full ${
                  slideIndex === currentIndex
                    ? "w-2.5 h-2.5 bg-black"
                    : "w-2 h-2 bg-black/30 hover:bg-black/50"
                }`}
                aria-label={`Go to image ${slideIndex + 1}`}
              />
            ))}
          </div>
        )}

        {/* Image Counter (optional, on top right) */}
        {images.length > 1 && (
          <div className="absolute top-4 right-4 bg-black/40 text-white text-xs font-medium px-3 py-1.5 rounded-full backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Strip Below (Left-Aligned) */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                index === currentIndex
                  ? "border-black ring-1 ring-black/20"
                  : "border-gray-200 hover:border-gray-400"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <div
                style={{
                  backgroundImage: `url('${getImageSrc(image)}')`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
                className="w-full h-full bg-gray-50"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSlider;
 