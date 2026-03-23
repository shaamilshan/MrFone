import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const StatsSection = () => {
  const [counts, setCounts] = useState({ sold: 0, customers: 0, years: 0 });
  const [hasAnimated, setHasAnimated] = useState(false);

  const stats = [
    { value: "5M+", label: "Accessories Sold" },
    { value: "2000+", label: "Happy Customers" },
    { value: "8+", label: "Years of Service" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounter();
        }
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById("stats-section");
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [hasAnimated]);

  const animateCounter = () => {
    // Simple animation - you can customize the target values
    const targets = { sold: 5000000, customers: 2000, years: 8 };
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic

      setCounts({
        sold: Math.floor(targets.sold * easeProgress),
        customers: Math.floor(targets.customers * easeProgress),
        years: Math.floor(targets.years * easeProgress),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setCounts(targets);
      }
    }, stepDuration);
  };

  return (
    <section
      id="stats-section"
      className="w-full bg-gray-50 py-16 md:py-24 my-10"
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
          {/* Stat 1 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-200 pb-8 md:pb-0"
          >
            <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-blue-600 mb-3">
              {hasAnimated ? "5M+" : "0"}
            </div>
            <p className="text-gray-600 text-sm md:text-base font-medium tracking-wide uppercase">
              Accessories Sold
            </p>
          </motion.div>

          {/* Stat 2 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-200 py-8 md:py-0"
          >
            <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-blue-600 mb-3">
              {hasAnimated ? "2000+" : "0"}
            </div>
            <p className="text-gray-600 text-sm md:text-base font-medium tracking-wide uppercase">
              Happy Customers
            </p>
          </motion.div>

          {/* Stat 3 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center justify-center text-center pt-8 md:pt-0"
          >
            <div className="text-5xl md:text-6xl lg:text-7xl font-bold text-blue-600 mb-3">
              {hasAnimated ? "8+" : "0"}
            </div>
            <p className="text-gray-600 text-sm md:text-base font-medium tracking-wide uppercase">
              Years of Service
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
