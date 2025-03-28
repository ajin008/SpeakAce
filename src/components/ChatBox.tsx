import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send } from "lucide-react";

interface ChatBoxProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ isOpen, onClose }) => {
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setMessages([...messages, chatMessage.trim()]);
      setChatMessage("");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-2 sm:right-4 md:right-8 w-80 max-w-[90vw] bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col z-50"
        >
          {/* Rest of the component remains the same */}
          {/* Chat Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-[#755CCD]">
              AI Interview Chat
            </h3>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </motion.button>
          </div>

          {/* Message List */}
          <div className="flex-grow overflow-y-auto p-4 space-y-2 max-h-[300px]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-2 self-end max-w-[80%] break-words text-gray-700"
              >
                {msg}
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="flex p-4 border-t border-gray-100">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow mr-2 p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#755CCD]/50 text-gray-700"
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              className="bg-[#755CCD]/90 hover:bg-[#755CCD] text-white p-2 rounded-full transition-colors"
            >
              <Send size={20} />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatBox;
