import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function ReviewSlider() {
  const reviews = [
    {
      name: 'Leslie Alexander',
      title: 'Freelance React Developer',
      message: "You made it so simple. My new site is so much faster and easier to work with than my old site. I just choose the page, make the change.",
      rating: 5,
      avatar: "https://cdn.rareblocks.xyz/collection/clarity/images/testimonial/4/avatar-male-1.png"
    },
    {
      name: 'Jacob Jones',
      title: 'Digital Marketer',
      message: "Simply the best. Better than all the rest. I’d recommend this product to beginners and advanced users.",
      rating: 5,
      avatar: "https://cdn.rareblocks.xyz/collection/clarity/images/testimonial/4/avatar-male-2.png"
    },
    {
      name: 'Jenny Wilson',
      title: 'Graphic Designer',
      message: "I cannot believe that I have got a brand new landing page after getting Omega. It was super easy to edit and publish.",
      rating: 5,
      avatar: "https://cdn.rareblocks.xyz/collection/clarity/images/testimonial/4/avatar-female.png"
    },
     {
      name: 'Jenny Wilson',
      title: 'Graphic Designer',
      message: "I cannot believe that I have got a brand new landing page after getting Omega. It was super easy to edit and publish.",
      rating: 5,
      avatar: "https://cdn.rareblocks.xyz/collection/clarity/images/testimonial/4/avatar-female.png"
    },
    // You can add more reviews here
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    focusOnSelect: true,
    draggable: true,
    arrows: false,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2, centerMode: true } },
      { breakpoint: 640, settings: { slidesToShow: 1, centerMode: true } },
    ],
  };

  return (
    <section className="py-12 bg-gray-50 sm:py-16 lg:py-20">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <h2 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl xl:text-5xl font-pj">
            Our happy clients say about us
          </h2>
        </div>

        <div className="mt-12 md:mt-20">
          <Slider {...settings}>
            {reviews.map((review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="bg-white mx-4 my-4 p-6 lg:p-8 rounded-3xl h-full flex flex-col justify-between min-h-[320px]">
      <div>
        <div className="flex items-center space-x-1">
          {[...Array(review.rating)].map((_, i) => (
            <svg
              key={i}
              className="w-5 h-5 text-[#FDB241]"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
        </div>
        <blockquote className="mt-6 text-lg text-gray-900 font-pj leading-relaxed">
          “{review.message}”
        </blockquote>
      </div>
      <div className="flex items-center mt-8">
        <img
          className="w-11 h-11 rounded-full object-cover"
          src={review.avatar}
          alt={review.name}
        />
        <div className="ml-4">
          <p className="text-base font-bold text-gray-900 font-pj">{review.name}</p>
          <p className="text-sm text-gray-600 font-pj">{review.title}</p>
        </div>
      </div>
    </div>
  );
}

export default ReviewSlider;
