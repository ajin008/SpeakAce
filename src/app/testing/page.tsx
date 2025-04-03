"use client";
import React, { useState } from "react";
import { vapi } from "@/lib/vapi.sdk";
import { toast } from "sonner";

const DummyTest = () => {
  const [isLoading, setIsLoading] = useState(false);

  const startTestCall = async () => {
    setIsLoading(true);
    try {
      console.log("Starting call with:", {
        workflowId: "319e26ee-b070-459c-abfe-368bee2332a8", // Use exact ID
        token: process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN?.slice(0, 5) + "...", // Log partial token
      });

      // Verify microphone access first
      await navigator.mediaDevices.getUserMedia({ audio: true });

      const call = await vapi.start({
        assistant: "319e26ee-b070-459c-abfe-368bee2332a8", // Exact ID from dashboard
        context: {
          username: "Test User",
        },
      });

      if (!call) throw new Error("No call object returned");

      // Add all event listeners
      const events = [
        "call-start",
        "call-end",
        "speech-start",
        "speech-end",
        "error",
      ];
      events.forEach((event) => {
        call.on(event, (data) => console.log(`${event}:`, data));
      });

      call.on("call-start", () => toast.success("Connected!"));
      call.on("call-end", () => {
        toast.success("Call completed");
        setIsLoading(false);
      });
      call.on("error", (error) => {
        toast.error(`Error: ${error.message}`);
        setIsLoading(false);
      });
    } catch (error) {
      console.error("Full error:", error);
      toast.error(
        `Failed: ${error instanceof Error ? error.message : "Unknown error"}`
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8">
      <button
        onClick={startTestCall}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isLoading ? "Connecting..." : "Test VAPI Integration"}
      </button>
      <p className="mt-4 text-sm text-gray-600">
        This will start a dummy call with no backend API involved
      </p>
    </div>
  );
};

export default DummyTest;
