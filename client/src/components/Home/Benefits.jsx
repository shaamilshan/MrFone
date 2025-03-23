import React from "react";
import { ShieldCheck, Clock, ThumbsUp } from "lucide-react";

const benefitsData = [
  {
    icon: <ShieldCheck size={40} className="text-blue-500" />,
    heading: "Secure & Reliable",
    description: "We prioritize security to ensure your data remains protected at all times."
  },
  {
    icon: <Clock size={40} className="text-green-500" />,
    heading: "Fast & Efficient",
    description: "Our services are optimized for speed and efficiency, giving you the best experience."
  },
  {
    icon: <ThumbsUp size={40} className="text-yellow-500" />,
    heading: "Customer Satisfaction",
    description: "We focus on delivering high-quality service to keep our customers happy."
  }
];

const Benefits = () => {
  return (
    <div className="bg-gray-100 py-12 px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {benefitsData.map((benefit, index) => (
          <div key={index} className="flex flex-col items-center text-center p-6">
            {benefit.icon}
            <h3 className="text-xl font-semibold mt-4">{benefit.heading}</h3>
            <p className="text-gray-600 mt-2">{benefit.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Benefits;
