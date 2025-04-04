"use client";
import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { vapi } from "@/lib/vapi.sdk";

enum VoiceState {
  Idle = "idle",
  Speaking = "speaking",
  Processing = "processing",
}

interface VoiceControlProps {
  onStart?: () => void;
  onCancel?: () => void;
  userId: string;
  userName: string;
  jobField: string;
}

const VoiceControl: React.FC<VoiceControlProps> = ({
  onStart,
  onCancel,
  userId,
  userName,
  jobField,
}) => {
  const [voiceState, setVoiceState] = useState<VoiceState>(VoiceState.Idle);
  const [collectedData, setCollectedData] = useState<{
    numQuestions?: string;
    experienceLevel?: string;
    interviewType?: string;
  }>({});

  const handleStart = useCallback(async () => {
    try {
      setVoiceState(VoiceState.Speaking);
      onStart?.();
      toast.success("Conversation started!");

      // Log for debugging
      console.log("Starting Vapi with userId:", userId);
      console.log("Starting Vapi with userName:", userName);
      console.log("Starting Vapi with jobField:", jobField);
      console.log("Assistant ID:", process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID);

      // Validate inputs
      if (!process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID) {
        throw new Error("NEXT_PUBLIC_VAPI_WORKFLOW_ID is not defined");
      }
      if (!userId || !userName || !jobField) {
        throw new Error("userId, userName, or jobField is missing");
      }

      // Set up event listeners BEFORE starting the call
      vapi.on("call-start", () => {
        console.log("Call has started.");
      });

      vapi.on("speech-start", () => {
        console.log("Assistant speech has started.");
        setVoiceState(VoiceState.Speaking);
      });

      vapi.on("speech-end", () => {
        console.log("Assistant speech has ended.");
        setVoiceState(VoiceState.Processing);
      });

      vapi.on("call-end", () => {
        console.log("Call has ended.");
        setVoiceState(VoiceState.Idle);
      });

      vapi.on("message", (message) => {
        console.log("Vapi message:", message);
        if (
          message.type === "transcript" &&
          message.transcriptType === "final" &&
          message.role === "user"
        ) {
          const userResponse = message.transcript.trim();
          console.log("User said:", userResponse);

          // Collect initial info
          if (!collectedData.techStack) {
            setCollectedData((prev) => ({ ...prev, techStack: userResponse }));
            vapi.speak(
              "Great! What is your experience level? (Beginner, mid-level, or senior-level)"
            );
          } else if (!collectedData.experienceLevel) {
            setCollectedData((prev) => ({
              ...prev,
              experienceLevel: userResponse,
            }));
            vapi.speak(
              "Got it! How many questions would you like me to prepare?"
            );
          } else if (!collectedData.numQuestions) {
            setCollectedData((prev) => ({
              ...prev,
              numQuestions: userResponse,
            }));
            vapi.speak(
              "Perfect! Sending your info to the backend to generate questions..."
            );

            // Send collected data to backend
            const payload = {
              userId,
              userName,
              jobField,
              techStack: userResponse,
              experienceLevel: collectedData.experienceLevel,
              numQuestions: userResponse,
            };
            const response = await fetch("/api/vapi/generate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error("Failed to generate questions");
            const data = await response.json();
            const questions = data.questions || [];

            setCollectedData((prev) => ({ ...prev, questions }));
            vapi.speak(`Here’s your first question: ${questions[0]}`);
          } else if (
            collectedData.questions &&
            !collectedData.answers?.[
              collectedData.questions.indexOf(questions[0])
            ]
          ) {
            setCollectedData((prev) => {
              const answers = [...(prev.answers || []), userResponse];
              return { ...prev, answers };
            });
            const currentIndex = collectedData.questions.indexOf(questions[0]);
            if (currentIndex + 1 < collectedData.questions.length) {
              vapi.speak(
                `Next question: ${collectedData.questions[currentIndex + 1]}`
              );
            } else {
              vapi.speak("Interview complete! Saving your answers...");
              // Send final data to backend for Firebase storage
              await fetch("/api/vapi/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  userId,
                  userName,
                  jobField,
                  questions: collectedData.questions,
                  answers,
                }),
              });
              vapi.stop();
            }
          }
        }
      });

      vapi.on("error", (error) => {
        console.error("Vapi error:", error);
        toast.error("Vapi error: " + error.message);
        setVoiceState(VoiceState.Idle);
      });

      // Start the Vapi assistant with the assistant ID as a string
      await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID, {
        variableValues: {
          userName,
          jobField,
        },
      });
    } catch (error) {
      console.error("Error in handleStart:", error);
      toast.error("Failed to start: " + error.message);
      setVoiceState(VoiceState.Idle);
    }
  }, [userName, jobField, userId, collectedData]);

  const handleCancel = useCallback(() => {
    if (voiceState !== VoiceState.Idle) {
      vapi.stop();
      setVoiceState(VoiceState.Idle);
      setCollectedData({});
      onCancel?.();
      toast.info("Interview cancelled.");
    }
  }, [voiceState, onCancel]);

  return (
    <div className="flex items-center space-x-4 bg-gray-100 px-4 py-2 rounded-full">
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleStart}
        disabled={voiceState !== VoiceState.Idle}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all 
          ${
            voiceState !== VoiceState.Idle
              ? "bg-orange-500 text-white"
              : "bg-white text-orange-500 border-4 border-orange-500 shadow-md"
          }`}
        aria-label={voiceState !== VoiceState.Idle ? "In Progress" : "Start"}
      >
        {voiceState === VoiceState.Processing ? (
          <div className="animate-spin h-6 w-6 border-2 border-white rounded-full border-t-transparent"></div>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="22"></line>
          </svg>
        )}
      </motion.button>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleCancel}
        disabled={voiceState === VoiceState.Idle}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all 
          ${
            voiceState === VoiceState.Idle
              ? "bg-gray-200 text-gray-400"
              : "bg-white text-black shadow-md"
          }`}
        aria-label="Cancel"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </motion.button>
    </div>
  );
};

export default VoiceControl;
