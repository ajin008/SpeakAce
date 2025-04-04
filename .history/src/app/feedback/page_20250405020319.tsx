"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Copy, Check, Star, Download, ArrowRight } from "lucide-react";

interface FeedbackItem {
  question: string;
  answer: string;
  feedback: string;
  score: number;
}

const FeedbackPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"summary" | "detailed">("summary");

  // Mock data - you'll replace this with your actual feedback data
  const mockFeedback = {
    jobRole: "Frontend Developer",
    overallScore: 82,
    feedbackItems: [
      {
        question: "Tell me about your experience with React.",
        answer:
          "I've been using React for 3 years, building complex UIs with hooks and context API.",
        feedback:
          "Good answer showing practical experience. Consider adding specific examples of complex problems you've solved.",
        score: 85,
      },
      {
        question: "How do you handle state management in large applications?",
        answer:
          "I use Redux for global state and React Context for component-level state. I've also used Zustand in recent projects.",
        feedback:
          "Strong technical response. Next time, explain your decision process for choosing different state management solutions.",
        score: 90,
      },
      {
        question: "Describe a challenging bug you've fixed recently.",
        answer:
          "I fixed a memory leak in a component that wasn't cleaning up event listeners properly.",
        feedback:
          "This answer could be more detailed. Try using the STAR method (Situation, Task, Action, Result) to structure your response.",
        score: 70,
      },
    ],
  };

  const handleCopyFeedback = () => {
    // Format feedback for copying
    const feedbackText = mockFeedback.feedbackItems
      .map(
        (item) =>
          `Q: ${item.question}\nA: ${item.answer}\nFeedback: ${item.feedback}\nScore: ${item.score}/100`
      )
      .join("\n\n");

    navigator.clipboard.writeText(feedbackText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `MockMate Interview Feedback - ${mockFeedback.jobRole}`,
          text: `Check out my interview feedback for ${mockFeedback.jobRole} position! Overall score: ${mockFeedback.overallScore}/100`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("Error sharing:", err);
        });
    } else {
      // Fallback for browsers that don't support the Web Share API
      handleCopyFeedback();
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Your Interview Feedback</h2>
          <p className="text-gray-600">
            Review your performance and get insights to improve
          </p>
        </motion.div>

        {/* Score Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <div>
              <h3 className="text-lg text-gray-500">
                Your overall performance
              </h3>
              <h2 className="text-3xl font-bold">{mockFeedback.jobRole}</h2>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center">
              <div className="mr-4 text-center">
                <div className="text-5xl font-bold text-purple-600">
                  {mockFeedback.overallScore}
                </div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={24}
                    className={`${
                      star <= Math.round(mockFeedback.overallScore / 20)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopyFeedback}
              className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700"
            >
              {copied ? (
                <Check size={18} className="mr-2" />
              ) : (
                <Copy size={18} className="mr-2" />
              )}
              {copied ? "Copied!" : "Copy"}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleShare}
              className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-md text-sm font-medium text-white"
            >
              <Share2 size={18} className="mr-2" />
              Share Results
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("summary")}
              className={`pb-4 relative ${
                activeTab === "summary"
                  ? "text-purple-600 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Summary
              {activeTab === "summary" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab("detailed")}
              className={`pb-4 relative ${
                activeTab === "detailed"
                  ? "text-purple-600 font-medium"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Detailed Feedback
              {activeTab === "detailed" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                />
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "summary" ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6"
          >
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow p-6"
            >
              <h3 className="text-xl font-bold mb-4">Performance Summary</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Technical Knowledge
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      85%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="bg-purple-600 h-2 rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Communication
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      78%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "78%" }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="bg-purple-600 h-2 rounded-full"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Problem Solving
                    </span>
                    <span className="text-sm font-medium text-gray-700">
                      82%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "82%" }}
                      transition={{ duration: 0.8, delay: 0.4 }}
                      className="bg-purple-600 h-2 rounded-full"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow p-6"
            >
              <h3 className="text-xl font-bold mb-4">Key Takeaways</h3>
              <ul className="space-y-3">
                <li className="flex">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-1 mr-3">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  </div>
                  <p className="text-gray-700">
                    Strong technical knowledge with practical examples
                  </p>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center mt-1 mr-3">
                    <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  </div>
                  <p className="text-gray-700">
                    Consider using the STAR method to structure answers
                  </p>
                </li>
                <li className="flex">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center mt-1 mr-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  </div>
                  <p className="text-gray-700">
                    Good problem-solving approach, but be more specific with
                    examples
                  </p>
                </li>
              </ul>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="bg-white rounded-xl shadow p-6"
            >
              <h3 className="text-xl font-bold mb-4">Recommended Next Steps</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium">
                      Practice Behavioral Questions
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Focus on using the STAR method and specific examples
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium">Work on System Design</h4>
                    <p className="text-gray-600 text-sm">
                      Build depth in architecture patterns and trade-offs
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium">
                      Schedule Another Mock Interview
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Focus on advanced topics to improve your score
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="space-y-6"
          >
            {mockFeedback.feedbackItems.map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white rounded-xl shadow p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">Question {index + 1}</h3>
                  <div className="bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full">
                    Score: {item.score}/100
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm text-gray-500 mb-1">Question</h4>
                  <p className="text-gray-800">{item.question}</p>
                </div>
                <div className="mb-4">
                  <h4 className="text-sm text-gray-500 mb-1">Your Answer</h4>
                  <p className="text-gray-800">{item.answer}</p>
                </div>
                <div className="mb-2">
                  <h4 className="text-sm text-gray-500 mb-1">Feedback</h4>
                  <p className="text-gray-800">{item.feedback}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Next Steps */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-6 rounded-lg"
          >
            Try Another Interview
            <ArrowRight size={20} className="ml-2" />
          </motion.button>
        </motion.div>

        {/* Download PDF option */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-8 text-center"
        >
          <button className="inline-flex items-center text-purple-600 hover:text-purple-800">
            <Download size={18} className="mr-1" />
            <span>Download full report</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default FeedbackPage;
