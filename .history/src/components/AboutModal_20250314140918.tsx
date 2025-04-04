"use client";

import { FC } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

interface AboutModalProps {
  onClose: () => void;
}

const AboutModal: FC<AboutModalProps> = ({ onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-xl p-8 rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glassmorphic background with black border */}
        <div className="absolute inset-0 bg-white bg-opacity-80 backdrop-blur-lg border-2 border-[#7959D8] rounded-lg shadow-lg" />

        {/* Content */}
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[black]">About Us</h2>
            <button
              onClick={onClose}
              className="text-black hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <X size={28} />
            </button>
          </div>

          <div className="text-[#16151A] text-lg">
            <p className="mb-5">
              Welcome to SpeakAce, where we believe in the power of effective
              communication. Our mission is to help you master the art of
              speaking with confidence and clarity.
            </p>
            <p className="mb-5">
              Founded in 2023, SpeakAce has quickly become a leading platform
              for speech improvement, offering cutting-edge tools and resources
              for students, professionals, and anyone looking to enhance their
              communication skills.
            </p>
            <p>
              Our team of expert linguists and communication specialists work
              tirelessly to deliver the best experience possible. Join us on
              this journey to becoming a more articulate and confident speaker!
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AboutModal;
