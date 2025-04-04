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
    setVoiceState(VoiceState.Speaking);
    onStart?.();
    toast.success("Interview started!");

    // Start the assistant using the ID from the dashboard
    vapi.start({
      assistantId: process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID, // "319e26ee-b070-459c-abfe-368bee2332a8"
      variables: {
        userName,
        jobField,
      },
    });

    vapi.on("speech-end", () => {
      setVoiceState(VoiceState.Processing);
    });

    vapi.on("message", async (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        const userResponse = message.transcript.toLowerCase();
        console.log("User said:", userResponse);

        // Handle responses as they come from the dashboard-configured flow
        if (!collectedData.numQuestions) {
          setCollectedData({ numQuestions: userResponse });
        } else if (!collectedData.experienceLevel) {
          setCollectedData((prev) => ({
            ...prev,
            experienceLevel: userResponse,
          }));
        } else if (!collectedData.interviewType) {
          setCollectedData((prev) => ({
            ...prev,
            interviewType: userResponse,
          }));

          const data = {
            userId,
            userName,
            jobField,
            numQuestions: collectedData.numQuestions,
            experienceLevel: userResponse.includes("beginner")
              ? "beginner"
              : userResponse.includes("intermediate")
              ? "intermediate"
              : "advanced",
            interviewType: userResponse,
          };

          setVoiceState(VoiceState.Processing);
          const response = await fetch(
            "https://speak-ace-yiot.vercel.app/api/vapi/generate",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            }
          );
          const result = await response.json();

          const questions = result.questions;
          let currentQuestionIndex = 0;

          const askNextQuestion = () => {
            if (currentQuestionIndex < questions.length) {
              vapi.say(questions[currentQuestionIndex]);
              setVoiceState(VoiceState.Speaking);
            } else {
              vapi.say(
                "Thank you for completing the interview! We'll provide feedback soon."
              );
              setVoiceState(VoiceState.Idle);
            }
          };

          askNextQuestion();

          vapi.on("message", async (msg) => {
            if (
              msg.type === "transcript" &&
              msg.transcriptType === "final" &&
              currentQuestionIndex < questions.length
            ) {
              const answer = msg.transcript;
              await fetch(
                "https://speak-ace-yiot.vercel.app/api/vapi/generate",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    userId,
                    answer,
                    question: questions[currentQuestionIndex],
                  }),
                }
              );
              currentQuestionIndex++;
              askNextQuestion();
            }
          });
        }
      }
    });
  }, [userId, userName, jobField, collectedData, onStart]);

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
