"use client";
import { FC, useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import SetupCardModal from "./SetupCardModal";
import axios from "axios";

interface InterviewHeadingProps {
  className?: string;
}

const InterviewHeading: FC<InterviewHeadingProps> = ({ className = "" }) => {
  const [inputValue, setInputValue] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const maxChars = 100;
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);

  // Calculate if text is approaching the button
  useEffect(() => {
    const checkTextPosition = () => {
      if (!inputRef.current || inputValue.length === 0) {
        setShowPreview(false);
        return;
      }

      const input = inputRef.current;
      const inputWidth = input.offsetWidth;
      const bufferWidth = window.innerWidth < 640 ? 90 : 110; // Buffer zone size

      // Create a hidden span to measure text width precisely with the current styling
      const span = document.createElement("span");
      span.style.font = getComputedStyle(input).font;
      span.style.visibility = "hidden";
      span.style.position = "absolute";
      span.style.whiteSpace = "nowrap";
      span.textContent = inputValue;
      document.body.appendChild(span);

      const textWidth = span.offsetWidth;
      document.body.removeChild(span);

      // Only show preview if text width approaches the input width minus buffer
      setShowPreview(textWidth > inputWidth - bufferWidth);
    };

    checkTextPosition();

    // Recalculate on window resize
    window.addEventListener("resize", checkTextPosition);
    return () => window.removeEventListener("resize", checkTextPosition);
  }, [inputValue]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleStartClick = () => {
    if (inputValue.trim()) {
      setIsSetupModalOpen(true);
    }
  };

  const handleSubmit = async (difficulty: string, questions: number) => {
    const data = {
      topic: inputValue,
      difficulty,
      questions,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/text/text-analysis`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Data submitted successfully");
      } else {
        console.error("Failed to submit data");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  return (
    <motion.div
      className={`flex flex-col items-center px-4 w-full ${className}`}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Main Heading */}
      <motion.h1
        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-3 sm:mb-4"
        variants={itemVariants}
      >
        <span className="text-gray-900">
          Master Your Tech Skills with Your{" "}
        </span>
        <span className="text-[#755CCD]">AI Reviewer</span>
      </motion.h1>

      {/* Subheading */}
      <motion.p
        className="text-gray-400 text-center text-base sm:text-lg mb-6 sm:mb-10 max-w-sm sm:max-w-md mx-auto"
        variants={itemVariants}
      >
        Submit your topic, get expert AI feedback, and excel as a tech student
        with personalized reviews.
      </motion.p>

      {/* Search/Input Field with improved text handling */}
      <motion.div
        className="w-full max-w-xs sm:max-w-sm md:max-w-md"
        variants={itemVariants}
      >
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter your field..."
            value={inputValue}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#755CCD] text-sm sm:text-base pr-24 sm:pr-28"
            maxLength={maxChars}
          />
          <button
            onClick={handleStartClick}
            className="absolute right-1 top-1 bg-orange-400 hover:bg-orange-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center justify-center transition-colors text-sm sm:text-base"
          >
            Start
            <ArrowRight size={14} className="ml-1 hidden sm:inline" />
          </button>
        </div>

        {/* Only show preview when text actually enters buffer zone */}
        {showPreview && (
          <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md max-h-20 overflow-y-auto">
            {inputValue}
          </div>
        )}
      </motion.div>
      {/* Setup Card Modal */}
      <SetupCardModal
        isOpen={isSetupModalOpen}
        onClose={() => setIsSetupModalOpen(false)}
        onStart={handleSubmit}
      />
    </motion.div>
  );
};

export default InterviewHeading;
