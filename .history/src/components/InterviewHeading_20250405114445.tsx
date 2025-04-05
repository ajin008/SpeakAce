"use client";
import { FC, useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth, SignInButton, useUser } from "@clerk/nextjs";
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

  const { user } = useUser(); // Client-side user hook

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

  const validateInput = async (input: string) => {
    try {
      const response = await fetch("/api/validate-input", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          input: input.trim(),
          jobField: input.trim(),
        }),
      });
      if (!response.ok) throw new Error("Validation failed");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Validation error:", error);
      return { isValid: false, message: "Validation service unavailable" };
    }
  };

  // Submit handler with validation
  const handleSubmit = useCallback(async () => {
    const trimmedValue = inputValue.trim();

    if (!trimmedValue) {
      toast.error("Please enter a job field");
      return;
    }

    const loadingToastId = toast.loading("Validating your input...");

    if (isSignedIn) {
      try {
        const validation = await validateInput(trimmedValue);

        if (!validation.isValid) {
          toast.dismiss(loadingToastId);
          toast.error(
            `Invalid input: ${
              validation.message || "Please enter a professional job field"
            }`
          );
          return;
        }

        // Dismiss loading toast before navigation
        toast.dismiss(loadingToastId);
        toast.success("Input validated! Preparing your interview...");

        sessionStorage.setItem(
          "interviewData",
          JSON.stringify({
            jobField: trimmedValue,
            userId: user.id,
            userName:
              `${user.firstName} ${user.lastName}`.trim() || "Anonymous",
          })
        );
        const reviewRoute = `/Review/${user.id}`;

        // Directly navigate to review page
        router.push(reviewRoute);
      } catch (error) {
        toast.error(
          "Failed to prepare interview: " +
            (error instanceof Error ? error.message : "Unknown error")
        );
        console.error("Error:", error);
      }
    } else {
      sessionStorage.setItem("interviewTopic", trimmedValue);
      // Handle guest user flow if needed
    }
  }, [inputValue, isSignedIn, router, user]);

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
        <span className="text-gray-900">Nail Your Next Interview with </span>
        <span className="text-[#755CCD]">AI-Powered Precision</span>
      </motion.h1>

      {/* Subheading */}
      <motion.p
        className="text-gray-400 text-center text-base sm:text-lg mb-6 sm:mb-10 max-w-sm sm:max-w-md mx-auto"
        variants={itemVariants}
      >
        Submit your job role, start the mock interview, and get instant AI
        feedback—it's that easy!
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
