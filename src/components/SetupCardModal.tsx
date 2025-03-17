"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  CircleSlash,
  X,
} from "lucide-react";

interface SetupCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStart: (difficulty: string, questions: number) => void; // Add onStart prop
}

const SetupCardModal: React.FC<SetupCardModalProps> = ({
  isOpen,
  onClose,
  onStart,
}) => {
  const [difficulty, setDifficulty] = useState<string>("");
  const [questions, setQuestions] = useState<number>(15);

  const difficulties = ["Easy", "Medium", "Hard"];
  const questionOptions = [10, 15, 20, 30];

  // Reset selections when modal opens
  useEffect(() => {
    if (isOpen) {
      setDifficulty("");
      setQuestions(15);
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, onClose]);

  // Animations
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.3 } },
  };

  const modalVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        delay: 0.1,
      },
    },
    exit: { opacity: 0, y: -50, scale: 0.95, transition: { duration: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // Handle start quiz button click
  const handleStartClick = () => {
    if (difficulty) {
      onStart(difficulty, questions); // Call onStart with selected options
      onClose();
    }
  };

  // Get icon based on difficulty
  const getDifficultyIcon = (level: string) => {
    switch (level) {
      case "Easy":
        return <CheckCircle2 className="text-green-500" size={18} />;
      case "Medium":
        return <AlertCircle className="text-yellow-500" size={18} />;
      case "Hard":
        return <CircleSlash className="text-red-500" size={18} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md px-4"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-xl shadow-xl p-6 w-full">
              {/* Header with close button */}
              <div className="flex justify-between items-center mb-6">
                <motion.h2
                  className="text-2xl font-bold text-gray-800"
                  variants={itemVariants}
                >
                  Set Up Your Review Session
                </motion.h2>
                <motion.button
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={onClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} className="text-gray-500" />
                </motion.button>
              </div>

              {/* Difficulty Selection */}
              <motion.div className="mb-8" variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Difficulty Level
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {difficulties.map((level) => (
                    <motion.button
                      key={level}
                      onClick={() => setDifficulty(level)}
                      className={`flex items-center justify-center px-4 py-3 rounded-lg border transition-all ${
                        difficulty === level
                          ? "border-[#755CCD] bg-indigo-50 text-[#755CCD]"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {getDifficultyIcon(level)}
                      <span className="ml-2">{level}</span>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Number of Questions */}
              <motion.div className="mb-8" variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Number of Questions
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {questionOptions.map((num) => (
                    <motion.button
                      key={num}
                      onClick={() => setQuestions(num)}
                      className={`py-2 px-3 rounded-lg border transition-all ${
                        questions === num
                          ? "border-[#755CCD] bg-indigo-50 text-[#755CCD"
                          : "border-gray-200 hover:border-gray-300 text-gray-600"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {num}
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Start Button */}
              <motion.button
                onClick={handleStartClick}
                disabled={!difficulty}
                className={`w-full flex items-center justify-center py-3 px-4 rounded-lg font-medium text-white transition-all ${
                  difficulty
                    ? "bg-[#F4AF29] hover:bg-[#F4AF29]"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
                variants={itemVariants}
                whileHover={difficulty ? { scale: 1.02 } : {}}
                whileTap={difficulty ? { scale: 0.98 } : {}}
              >
                Start
                <ChevronRight size={18} className="ml-1" />
              </motion.button>

              {/* Error Message */}
              {!difficulty && (
                <motion.p
                  className="text-sm text-[#857B7B] mt-2 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Please select a difficulty level
                </motion.p>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SetupCardModal;
