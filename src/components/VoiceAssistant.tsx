"use client";
import { FC, useState } from "react";
import { Mic } from "lucide-react";
import { motion } from "framer-motion";

interface VoiceAssistantProps {
  onActivate?: () => void;
  isListening?: boolean;
}

const VoiceAssistant: FC<VoiceAssistantProps> = ({
  onActivate = () => {},
  isListening = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      className={`
        flex items-center gap-2 px-4 py-2 
        rounded-full border border-gray-200 
        transition-colors duration-200 
        ${
          isListening
            ? "border-purple-400 bg-purple-50"
            : "bg-white hover:bg-gray-50"
        }
      `}
      onClick={onActivate}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        animate={{
          color: isListening ? "#8b5cf6" : isHovered ? "#6b7280" : "#8b5cf6",
        }}
      >
        <Mic size={14} className="text-[#755CCD]" />
      </motion.div>
      <span className="text-[#755CCD] text-sm font-medium">
        Voice-Powered AI Assistant
      </span>
    </motion.button>
  );
};

export default VoiceAssistant;
