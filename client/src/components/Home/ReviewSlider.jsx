import React, { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function ReviewSlider() {
  const sliderRef = useRef(null);

  const reviews = [
    {
      name: 'Karan',
      time: '1 week ago',
      message: "My buying experience is so nice, and received me very politely. Riding experience is also very good. Very good performance. I never experienced such a kind of performance. Very good service.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      name: 'Catherine',
      time: '10 days ago',
      message: "I love my e-bike and the customer service is excellent. They respond in a timely manner with loads of information about e-bikes, accessories and maintenance information.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      name: 'Peter',
      time: '2 weeks ago',
      message: "Visited to EO store. Product particularly welds, looked good. My wife and I took small test ride in parking lot area. We bought one with customization after we went over all the options. Very satisfied.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/46.jpg"
    },
    {
      name: 'Sarah',
      time: '3 weeks ago',
      message: "Absolutely thrilled with my purchase! The build quality is top-notch, and the daily commute has never been this enjoyable. Highly recommend to everyone.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    }
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const next = () => {
    sliderRef.current.slickNext();
  };

  const previous = () => {
    sliderRef.current.slickPrev();
  };

  return (
    <section className="py-16 bg-[#FAFAFA] sm:py-20 lg:py-24 overflow-hidden">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <h2 className="text-4xl md:text-5xl text-gray-900 tracking-tight leading-snug">
            Read reviews,<br />
            <span className="font-bold">ride with confidence.</span>
          </h2>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-sm sm:text-base">
            <span className="font-semibold text-gray-800">4.2/5</span>
            <div className="flex items-center text-black font-bold">
              <svg className="w-6 h-6 mr-1 text-[#00b67a]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xl tracking-tight">Trustpilot</span>
            </div>
            <span className="text-gray-500">Based on 5210 reviews</span>
          </div>
        </div>

        {/* Content Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-start">
          
          {/* Left Navigation Details */}
          <div className="lg:col-span-1 flex flex-col justify-center px-4 pt-4 lg:pt-16">
            <svg className="w-16 h-16 text-gray-400 mb-8" fill="currentColor" viewBox="0 0 32 32">
              <path d="M10 16c0-4.418 3.582-8 8-8v-4c-6.627 0-12 5.373-12 12v12h12v-12h-8zM26 16c0-4.418 3.582-8 8-8v-4c-6.627 0-12 5.373-12 12v12h12v-12h-8z" />
            </svg>
            <h3 className="text-2xl sm:text-3xl font-medium text-gray-900 mb-10 leading-snug">
              What our<br className="hidden lg:block"/> customers are<br className="hidden lg:block"/> saying
            </h3>
            
            {/* Arrows */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={previous} 
                className="p-1 text-gray-400 hover:text-black transition"
                aria-label="Previous review"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
              </button>
              <div className="w-20 h-[1.5px] bg-gray-300 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-gray-800 rounded-full"></div>
              </div>
              <button 
                onClick={next} 
                className="p-1 text-gray-400 hover:text-black transition"
                aria-label="Next review"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right Slider */}
          <div className="lg:col-span-3 pb-8">
            <Slider ref={sliderRef} {...settings} className="review-slider -mx-4 lg:-mx-0 lg:-mr-[50vw]">
              {reviews.map((review, index) => (
                <ReviewCard key={index} review={review} />
              ))}
            </Slider>
          </div>

        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="px-3 sm:px-4 py-6 h-full outline-none">
      {/* Container for Drop shadow to apply to the main bubble + tail */}
      <div className="filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.04)] h-full flex flex-col justify-between group cursor-pointer transition-all duration-300">
        
        {/* Bubble */}
        <div className="bg-white p-7 sm:p-9 rounded-[24px] relative mb-8 flex-grow">
          <p className="text-[15px] sm:text-[16px] text-gray-700 leading-relaxed min-h-[160px]">
            {review.message}
          </p>
          
          <div className="flex items-center space-x-0.5 mt-6">
            {[...Array(review.rating)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 text-[#00b67a]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>

          {/* Bubble Tail */}
          <div className="absolute -bottom-3 left-10 w-6 h-6 bg-white transform rotate-45 rounded-sm"></div>
        </div>

        {/* User Info */}
        <div className="flex items-center px-4 mt-2">
          <img
            className="w-12 h-12 rounded-full object-cover shadow-sm bg-gray-100"
            src={review.avatar}
            alt={review.name}
          />
          <div className="ml-4">
            <p className="text-[15px] font-bold text-gray-900 leading-tight">{review.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">{review.time}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReviewSlider;

