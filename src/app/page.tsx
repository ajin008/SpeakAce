"use client";
import { useEffect } from "react";
import InterviewHeading from "@/components/InterviewHeading";
import VoiceAssistant from "@/components/VoiceAssistant";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

export default function Home() {
  const router = useRouter();

  const { isSignedIn } = useAuth();

  // Save user data to Firestore after sign-in
  useEffect(() => {
    console.log("isSignedIn:", isSignedIn);
    if (isSignedIn) {
      console.log("User is signed in, calling /api/user");
      const saveUserData = async () => {
        try {
          const response = await fetch("/api/user");
          const data = await response.json();
          if (!response.ok) {
            console.error("Error saving user data:", data.error);
          }
        } catch (error) {
          console.error("Error calling /api/user:", error);
        }
      };

      saveUserData();
    }
  }, [isSignedIn]);

  const handleStart = (topic: string) => {
    sessionStorage.setItem("interviewTopic", topic);
    router.push("/ReviewPage");
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen -mt-24">
      <div className="mb-16">
        <VoiceAssistant />
      </div>

      <InterviewHeading onStart={handleStart} />
    </div>
  );
}
