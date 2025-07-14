import React, { useEffect, useState } from "react";

const OfferHeader = () => {
  const messages = [
    "Free shipping on all orders above ₹500",
    "Sign up now and get 10% off your first order",
    "Refer a friend and earn rewards!"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(false); // start slide-out
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
        setShow(true); // start slide-in
      }, 300); // match animation duration
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full text-xs bg-black text-white py-4 overflow-hidden relative h-6">
      <div className="relative w-full h-full flex justify-center items-center">
        <div
          className={`absolute transition-all duration-300 ease-in-out ${
            show
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }`}
          key={currentIndex}
        >
          {messages[currentIndex]}
        </div>
      </div>
    </div>
  );
};

export default OfferHeader;
