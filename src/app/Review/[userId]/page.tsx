"use client";
import { useAuth, useUser } from "@clerk/nextjs";
import VideoConference from "@/components/VideoConference";
import { useEffect, useState } from "react";

const ReviewPage = () => {
  const { isLoaded, userId } = useAuth();
  const { user } = useUser();
  const [interviewData, setInterviewData] = useState<{
    jobField: string;
    userId: string;
    userName: string;
  } | null>(null);

  // Load interview data from sessionStorage
  useEffect(() => {
    const storedData = sessionStorage.getItem("interviewData");
    if (storedData) {
      setInterviewData(JSON.parse(storedData));
    }
  }, []);

  if (!isLoaded || !interviewData) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return <div>Please sign in to access this page</div>;
  }

  const userName = user
    ? `${user.firstName} ${user.lastName}`.trim() || "Anonymous"
    : "Anonymous";

  return (
    <div className="max-w-7xl mx-auto px-4 h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl -mt-28">
        <VideoConference
          userId={userId}
          userName={userName}
          jobField={interviewData.jobField}
        />
      </div>
    </div>
  );
};

export default ReviewPage;
