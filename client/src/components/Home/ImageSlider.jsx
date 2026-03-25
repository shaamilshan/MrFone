import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Image1 from "../../assets/banner/banner-iphone.avif";
import Image2 from "../../assets/banner/Banner-ipad-pro.jpg";
import Image3 from "../../assets/banner/mac.jpg";

const slides = [
  {
    image: Image1,
    tag: "New Release",
    title: "iPhone 16 Pro",
    subtitle: "Titanium. So strong. So light. So Pro.",
    cta: "Shop Now",
  },
  {
    image: Image2,
    tag: "Best Seller",
    title: "iPad Pro",
    subtitle: "The ultimate iPad experience. Impossibly thin. Incredibly powerful.",
    cta: "Explore",
  },
  {
    image: Image3,
    tag: "Top Pick",
    title: "MacBook Pro",
    subtitle: "Mind-blowing. Head-turning.",
    cta: "Learn More",
  },
];

function ImageSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const totalSlides = slides.length;
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }, 6000);
    return () => clearInterval(interval);
  }, [currentIndex, totalSlides]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  const current = slides[currentIndex];

  const textVariants = {
    enter: (dir) => ({ opacity: 0, y: dir > 0 ? 50 : -50 }),
    center: { opacity: 1, y: 0 },
    exit: (dir) => ({ opacity: 0, y: dir > 0 ? -50 : 50 }),
  };

  const imageVariants = {
    enter: { opacity: 0, scale: 1.1 },
    center: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 },
  };

  return (
    <section className="relative h-[75vh] md:h-[90vh] w-full overflow-hidden bg-black">
      
      {/* Full Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${currentIndex}`}
          variants={imageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={current.image}
            alt={current.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />

      {/* Text Overlay Content */}
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={`text-${currentIndex}`}
              custom={direction}
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="max-w-2xl"
            >
              {/* Tag */}
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.25em] text-white/80 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-6 border border-white/20">
                {current.tag}
              </span>

              {/* Title */}
              <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black text-white tracking-tight leading-[1.05] mb-5">
                {current.title}
              </h1>

              {/* Subtitle */}
              <p className="text-lg md:text-xl text-white/70 font-medium max-w-lg mb-10 leading-relaxed">
                {current.subtitle}
              </p>

              {/* CTA Button */}
              <button
                onClick={() => navigate("/collections")}
                className="group inline-flex items-center gap-3 bg-white text-black text-sm font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-2xl active:scale-95"
              >
                {current.cta}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-8 left-6 md:left-12 lg:left-20 flex items-center gap-4 z-30">
        {/* Slide Counter */}
        <span className="text-sm font-bold text-white/50 tabular-nums">
          {String(currentIndex + 1).padStart(2, "0")} / {String(totalSlides).padStart(2, "0")}
        </span>

        {/* Dot indicators */}
        <div className="flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className={`rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? "bg-white w-8 h-2.5"
                  : "bg-white/40 w-2.5 h-2.5 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* Arrow buttons */}
        <div className="flex items-center gap-1.5 ml-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-full border border-white/30 bg-white/10 backdrop-blur text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-full border border-white/30 bg-white/10 backdrop-blur text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}

export default ImageSlider;
