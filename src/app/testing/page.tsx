"use client";
import React, { useState } from "react";
import { vapi } from "@/lib/vapi.sdk";
import { toast } from "sonner";

const DummyTest = () => {
  const [isLoading, setIsLoading] = useState(false);

  const startTestCall = async () => {
    setIsLoading(true);
    try {
      const call = await vapi.start({
        assistant: "319e26ee-b070-459c-abfe-368bee2332a8",
        context: {
          username: "Test User", // Hardcoded for testing
        },
      });

      call.on("call-start", () => {
        toast.success("Call started!");
      });

      call.on("call-end", () => {
        toast.success("Call ended");
        setIsLoading(false);
      });

      call.on("error", (error) => {
        toast.error(`Error: ${error.message}`);
        setIsLoading(false);
      });
    } catch (error) {
      toast.error("Failed to start call");
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
