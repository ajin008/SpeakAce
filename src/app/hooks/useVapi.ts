import { useState, useEffect, useCallback } from "react";
import { vapi } from "@/lib/vapi.skd";

export const useVapi = () => {
  const [callStatus, setCallStatus] = useState<
    "idle" | "starting" | "active" | "ended" | "paused"
  >("idle");
  const [transcript, setTranscript] = useState("");
  const [call, setCall] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [answers, setAnswers] = useState<string[]>([]);

  const startCall = useCallback(async (workflowId: string, context?: any) => {
    setCallStatus("starting");
    try {
      const newCall = await vapi.start({
        workflowId,
        context,
      });

      newCall.on("call-start", () => {
        setCallStatus("active");
      });

      newCall.on("speech-start", () => {
        setTranscript((prev) => prev + "\nAI: ");
      });

      newCall.on("speech-end", () => {
        // When AI finishes speaking, save it as a question
        if (transcript.includes("AI:")) {
          setQuestions((prev) => [
            ...prev,
            transcript.split("AI:").pop() || "",
          ]);
        }
      });

      newCall.on("transcript", (t) => {
        setTranscript((prev) => prev + t.transcript);
        // When user speaks, save it as an answer
        if (!t.transcript.includes("AI:")) {
          setAnswers((prev) => [...prev, t.transcript]);
        }
      });

      newCall.on("call-end", () => {
        setCallStatus("ended");
        // Save Q&A to database here if needed
        saveInterviewData(questions, answers);
      });

      setCall(newCall);
      return newCall;
    } catch (error) {
      setCallStatus("idle");
      throw error;
    }
  }, []);

  const saveInterviewData = async (questions: string[], answers: string[]) => {
    // Implement saving to your database
    console.log("Saving interview data:", { questions, answers });
  };

  // ... rest of the hook methods (endCall, pauseCall, resumeCall, toggleMute)

  return {
    callStatus,
    transcript,
    isMuted,
    questions,
    answers,
    startCall,
    endCall,
    pauseCall,
    resumeCall,
    toggleMute,
  };
};
