"use client";
import React from "react";
import { motion } from "framer-motion";

export default function AiGreeting() {
  const greetingText = "Hi, I am your AI assistant. Can we start?";

  // Text animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        duration: 0.8,
      },
    },
  };

  // Dot animation variants
  const dotVariants = {
    animate: {
      scale: [1, 1.4, 1],
      transition: {
        duration: 0.6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  // Container for dots
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="flex flex-col items-center justify-center' h-[15vh] ">
      {/* Pulsing background */}
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0.8, 1, 1.1, 1],
          opacity: [0, 1, 1, 1],
          transition: {
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          },
        }}
      >
        {/* Dot loading animation */}
        <motion.div
          className="flex space-x-2"
          variants={containerVariants}
          animate="animate"
        >
          <motion.div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: "#F4AF29" }}
            variants={dotVariants}
          />
          <motion.div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: "#755CCD" }}
            variants={dotVariants}
          />
          <motion.div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: "#F4AF29" }}
            variants={dotVariants}
          />
        </motion.div>
      </motion.div>

      {/* Greeting text */}
      <motion.h1
        className="mt-8 text-2xl font-semibold text-gray-800"
        variants={textVariants}
        initial="hidden"
        animate="visible"
      >
        {greetingText}
      </motion.h1>
    </div>
  );
}
