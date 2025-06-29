import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import HomeImg from "../../assets/trendskart/home/artbrd1.jpg";
import Image2 from "../../assets/trendskart/home/artbrd2.jpg";
import Image3 from "../../assets/trendskart/home/artbrd3.jpg";

const images = [HomeImg, Image2, Image3];

function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalImages = images.length;

  // Automatically change slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? totalImages - 1 : prevIndex - 1
    );
  };

  return (
    <div className="flex flex-col">
      <main>
        <section className="relative bg-[#C84332] lg:h-[75vh] sm:h-[50vh] w-full overflow-hidden">
          <div className="relative h-full w-full">
            {/* Navigation Buttons */}
            <Button
              className="absolute left-10 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-transform scale-110 opacity-70"
              size="icon"
              variant="ghost"
              onClick={handlePrev}
            >
              <ChevronLeft className="h-8 w-8 text-black" />
            </Button>
            <Button
              className="absolute right-10 top-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-transform scale-110 opacity-70"
              size="icon"
              variant="ghost"
              onClick={handleNext}
            >
              <ChevronRight className="h-8 w-8 text-black" />
            </Button>

            {/* Sliding Image Container */}
            <div
              className="flex h-full w-full transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative h-full w-full flex-shrink-0"
                >
                  <img
                    alt={`Slide ${index}`}
                    className="h-full w-full object-cover"
                    src={image}
                  />
                  {/* Shop Now Button */}
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                    <Button className=" rounded-full bg-red-600 px-6 py-2  text-white font-semibold shadow-md hover:bg-red-700">
                      Shop Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots Navigation */} 
            <div className="absolute bottom-12 right-6 flex items-center gap-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    index === currentIndex
                      ? "bg-white w-6"
                      : "bg-white opacity-50 w-2"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ImageSlider;
