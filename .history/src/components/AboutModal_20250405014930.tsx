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
              Welcome to MockMate – your friendly neighborhood interview
              sidekick.
            </p>
            <p className="mb-5">
              Let’s face it – job interviews can feel like mini boss battles.
              That’s where MockMate steps in. Built in 2025 with caffeine, code,
              and compassion, MockMate is here to help jobseekers level up their
              confidence and communication before stepping into the real ring.
              Whether you're prepping for your first job or aiming for that
              dream role, MockMate simulates realistic mock interviews with
              AI-powered feedback that actually makes sense (no vague “Be more
              confident” advice here 🙄).
            </p>
            <p>
              With voice-based Q&A, instant feedback, and a sprinkle of humor to
              keep your nerves in check, we’re on a mission to turn sweaty palms
              into solid handshakes (metaphorically, of course). So suit up (or
              not, we won’t judge), fire up MockMate, and get ready to crush
              that next interview like a boss.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AboutModal;
