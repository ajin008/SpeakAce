"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Crown, Info } from "lucide-react";

const PricingCard = ({
  title,
  price,
  features,
  excludedFeatures,
  backgroundColor,
  textColor,
  iconColor,
  isMostPopular = false,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`relative w-full max-w-xs sm:max-w-sm md:max-w-md mx-auto p-4 sm:p-6 rounded-xl shadow-lg group 
        transform transition-all duration-300 
        ${
          isMostPopular
            ? "border-2 border-purple-500"
            : "border border-gray-200"
        }
        hover:shadow-2xl hover:scale-105`}
    >
      {/* Most Popular Badge */}
      {isMostPopular && (
        <div className="absolute top-0 right-0 m-2 bg-purple-500 text-white px-2 py-1 rounded-full text-xs">
          Most Popular
        </div>
      )}

      {/* Card Header */}
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <div className="flex items-center">
          <Crown size={28} color={iconColor} className="mr-2 sm:mr-4" />
          <h2 className="text-xl sm:text-2xl font-bold">{title}</h2>
        </div>

        {/* Info Button */}
        <motion.button
          onClick={() => setShowDetails(!showDetails)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="text-gray-500 hover:text-gray-800"
        >
          <Info size={20} />
        </motion.button>
      </div>

      {/* Price */}
      <div className="text-3xl sm:text-4xl font-extrabold mb-3 sm:mb-4 flex items-center">
        ₹{price}
        <span className="text-xs sm:text-sm ml-1 sm:ml-2 text-gray-500">
          /month
        </span>
      </div>

      {/* Features */}
      <div className="mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
          Features
        </h3>
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center mb-1 sm:mb-2"
          >
            <Check size={16} color="green" className="mr-2" />
            <span className="text-sm sm:text-base">{feature}</span>
          </motion.div>
        ))}
      </div>

      {/* Detailed Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute left-0 right-0 bg-white shadow-lg rounded-b-xl p-3 sm:p-4 mt-1 sm:mt-2 z-10"
          >
            <h4 className="font-bold text-sm sm:text-base mb-1 sm:mb-2">
              Detailed Plan Information
            </h4>
            {excludedFeatures && (
              <div>
                <h5 className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">
                  Excluded Features:
                </h5>
                {excludedFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center mb-1">
                    <X size={14} color="red" className="mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm line-through text-gray-400">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Choose Plan Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`w-full py-2 sm:py-3 rounded-full font-bold text-sm sm:text-base ${backgroundColor} ${textColor} 
          transition-all duration-300 group-hover:brightness-110`}
      >
        Choose {title} Plan
      </motion.button>
    </motion.div>
  );
};

const Page = () => {
  const pricingPlans = [
    {
      title: "Basic",
      price: 49,
      features: [
        "Up to 10 AI Reviews per month",
        "Basic performance analytics",
        "Standard feedback generation",
        "Email support",
      ],
      excludedFeatures: [
        "Advanced learning insights",
        "Priority support",
        "Custom AI model training",
      ],
      backgroundColor: "bg-blue-500",
      textColor: "text-white",
      iconColor: "blue",
    },
    {
      title: "Pro",
      price: 99,
      features: [
        "Up to 50 AI Reviews per month",
        "Advanced performance analytics",
        "Detailed feedback generation",
        "Priority email support",
        "Advanced learning insights",
      ],
      excludedFeatures: [
        "Custom AI model training",
        "Dedicated account manager",
      ],
      backgroundColor: "bg-[#755CCD]",
      textColor: "text-white",
      iconColor: "purple",
      isMostPopular: true,
    },
    {
      title: "Enterprise",
      price: 149,
      features: [
        "Unlimited AI Reviews",
        "Comprehensive performance analytics",
        "Advanced feedback generation",
        "24/7 dedicated support",
        "Custom AI model training",
        "Dedicated account manager",
      ],
      backgroundColor: "bg-green-500",
      textColor: "text-white",
      iconColor: "green",
    },
  ];

  return (
    <div className="min-h-screen bg-[#ffffff] py-8 sm:py-12 px-4 mt-8 sm:mt-10">
      <div className="container mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12"
        >
          Pricing for AI Reviewer
        </motion.h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} {...plan} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-center mt-8 sm:mt-12 max-w-2xl mx-auto"
        >
          <p className="text-sm sm:text-base text-gray-600">
            Empower your learning journey with AI-powered reviews. Choose the
            plan that best fits your educational needs and take your
            self-learning to the next level.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Page;
