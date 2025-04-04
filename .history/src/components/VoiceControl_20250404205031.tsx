"use client";
import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner"; // For user feedback
import { vapi, checkVapiHealth } from "@/lib/vapi.sdk";

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
  interviewType: string;
  experienceLevel: string;
  amount: number;
}

const VoiceControl: React.FC<VoiceControlProps> = ({
  onStart,
  onCancel,
  userId,
  userName,
  jobField,
  interviewType,
  experienceLevel,
  amount,
}) => {
  const [voiceState, setVoiceState] = useState<VoiceState>(VoiceState.Idle);

  const handleStart = useCallback(async () => {}, []);

  const handleCancel = useCallback(() => {
    if (
      voiceState === VoiceState.Speaking ||
      voiceState === VoiceState.Processing
    ) {
      setVoiceState(VoiceState.Idle);
      onCancel?.();
      toast.info("Interview cancelled.");
    }
  }, [voiceState, onCancel]);

  return (
    <div className="flex items-center space-x-4 bg-gray-100 px-4 py-2 rounded-full">
      {/* Microphone Button */}
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
          // Show spinner for processing state
          <div className="animate-spin h-6 w-6 border-2 border-white rounded-full border-t-transparent"></div>
        ) : (
          // Show microphone icon for other states
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

      {/* Cancel Button */}
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
