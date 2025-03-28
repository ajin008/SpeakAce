import React from "react";
import { motion } from "framer-motion";

interface LoadingFallbackProps {
  message?: string;
}

const LoadingFallback: React.FC<LoadingFallbackProps> = ({
  message = "Processing...",
}) => {
  // Create an array for dots
  const dots = [0, 1, 2, 3, 4];

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[400px] w-full rounded-lg p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Dot loader container */}
      <div className="relative flex items-center justify-center h-32 w-full">
        {dots.map((dot, index) => (
          <motion.div
            key={index}
            className="mx-2 bg-indigo-600 rounded-full"
            style={{
              width: "24px",
              height: "24px",
            }}
            animate={{
              y: [0, -40, 0],
              backgroundColor: [
                "rgb(79, 70, 229)", // indigo-600
                "rgb(99, 102, 241)", // indigo-500
                "rgb(79, 70, 229)", // indigo-600
              ],
              boxShadow: [
                "0 0 0 rgba(79, 70, 229, 0.3)",
                "0 8px 16px rgba(79, 70, 229, 0.5)",
                "0 0 0 rgba(79, 70, 229, 0.3)",
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.15,
            }}
          />
        ))}
      </div>

      {/* Loading message */}
      {message && (
        <motion.p
          className="mt-8 text-2xl font-medium text-indigo-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {message}
          <motion.span
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            ...
          </motion.span>
        </motion.p>
      )}

      {/* Optional additional text */}
      <motion.p
        className="mt-4 text-md text-indigo-400 text-center max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.6 }}
      >
        This may take a moment
      </motion.p>
    </motion.div>
  );
};

export default LoadingFallback;
