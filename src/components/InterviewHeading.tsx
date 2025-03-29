"use client";
import { FC, useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { toast } from "sonner";

interface InterviewHeadingProps {
  className?: string;
  onStart: (topic: string) => void;
}

const InterviewHeading: FC<InterviewHeadingProps> = ({
  className = "",
  onStart,
}) => {
  const [inputValue, setInputValue] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const maxChars = 100;
  const router = useRouter();

  const { isSignedIn } = useAuth();

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

  // Submit handler with validation
  const handleSubmit = useCallback(async () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      toast.error("Please enter a topic");
      return;
    }

    if (isSignedIn) {
      try {
        toast.loading("Preparing your interview...");

        const response = await fetch("/api/vapi/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            techStack: trimmedValue,
            userId: "user_2uu7zjlzTb9cDUbsdusdZEE6zvS",
          }),
        });

        // Only proceed if response is successful
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || "Request failed");
        }

        const data = await response.json();

        // Additional success check
        if (!data?.success) {
          throw new Error(data.error || "Invalid response");
        }

        console.log("API Response:", data);

        // ONLY NAVIGATE IF EVERYTHING SUCCEEDS
        toast.success("review ready!");
        router.push(`/Review/${data.interviewId}`);
      } catch (error) {
        toast.dismiss(); // Clear loading state
        toast.error(error instanceof Error ? error.message : "Failed to start");
        console.error("Interview creation failed:", error);
      }
    } else {
      sessionStorage.setItem("interviewTopic", trimmedValue);
    }
  }, [inputValue, isSignedIn, router]);

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
        <span className="text-gray-900">Master Your Skills with Your </span>
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
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder="Enter your field..."
            value={inputValue}
            onChange={handleInputChange}
            className="w-full px-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#755CCD] text-sm sm:text-base pr-20 sm:pr-24"
            maxLength={maxChars}
          />

          {isSignedIn ? (
            <button
              onClick={handleSubmit}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-orange-400 hover:bg-orange-500 text-white px-3 sm:px-4 py-1.5 rounded-full flex items-center justify-center transition-colors text-sm sm:text-base"
            >
              Start
              <ArrowRight size={14} className="ml-1 hidden sm:inline" />
            </button>
          ) : (
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2">
              <SignInButton mode="modal">
                <button
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-orange-400 hover:bg-orange-500 text-white px-3 sm:px-4 py-1.5 rounded-full flex items-center justify-center transition-colors text-sm sm:text-base"
                  onClick={(e) => {
                    e.preventDefault();
                    if (inputValue.trim()) {
                      sessionStorage.setItem("interviewTopic", inputValue);
                    }
                  }}
                >
                  Start
                  <ArrowRight size={14} className="ml-1 hidden sm:inline" />
                </button>
              </SignInButton>
            </div>
          )}
        </div>

        {/* Only show preview when text actually enters buffer zone */}
        {showPreview && (
          <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-md max-h-20 overflow-y-auto">
            {inputValue}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default InterviewHeading;
