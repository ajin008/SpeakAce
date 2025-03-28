import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import ChatBox from "./ChatBox";

enum VoiceState {
  Idle = "idle",
  Speaking = "speaking",
  Paused = "paused",
}

interface VoiceControlProps {
  onStart?: () => void;
  onPause?: () => void;
  onCancel?: () => void;
}

const VoiceControl: React.FC<VoiceControlProps> = ({
  onStart,
  onPause,
  onCancel,
}) => {
  const [voiceState, setVoiceState] = useState<VoiceState>(VoiceState.Idle);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleStart = useCallback(() => {
    if (voiceState === VoiceState.Idle || voiceState === VoiceState.Paused) {
      setVoiceState(VoiceState.Speaking);
      onStart?.();
    }
  }, [voiceState, onStart]);

  const handlePause = useCallback(() => {
    if (voiceState === VoiceState.Speaking) {
      setVoiceState(VoiceState.Paused);
      onPause?.();
    } else if (voiceState === VoiceState.Paused) {
      setVoiceState(VoiceState.Speaking);
      onStart?.(); // Resume
    }
  }, [voiceState, onPause, onStart]);

  const handleCancel = useCallback(() => {
    setVoiceState(VoiceState.Idle);
    onCancel?.();
  }, [onCancel]);

  return (
    <div className="flex items-center space-x-4 bg-gray-100 px-4 py-2 rounded-full">
      {/* Pause Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handlePause}
        disabled={voiceState === VoiceState.Idle}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all 
          ${
            voiceState === VoiceState.Idle
              ? "bg-gray-200 text-gray-400"
              : "bg-white text-[#755CCD] shadow-md"
          }`}
        aria-label={voiceState === VoiceState.Paused ? "Resume" : "Pause"}
      >
        {voiceState === VoiceState.Paused ? (
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
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        ) : (
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
            <rect x="6" y="4" width="4" height="16"></rect>
            <rect x="14" y="4" width="4" height="16"></rect>
          </svg>
        )}
      </motion.button>

      {/* Microphone Button */}
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={handleStart}
        disabled={voiceState === VoiceState.Speaking}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all 
          ${
            voiceState === VoiceState.Speaking
              ? "bg-orange-500 text-white"
              : "bg-white text-orange-500 border-4 border-orange-500 shadow-md"
          }`}
        aria-label={voiceState === VoiceState.Speaking ? "Speaking" : "Start"}
      >
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

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="w-14 h-14 bg-[#755CCD] text-white rounded-full flex items-center justify-center shadow-lg"
        aria-label="Open Chat"
      >
        <MessageCircle size={24} />
      </motion.button>

      <ChatBox isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default VoiceControl;
