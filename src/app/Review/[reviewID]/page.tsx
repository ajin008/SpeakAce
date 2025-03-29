"use client";
import { useAuth } from "@clerk/nextjs";
import VideoConference from "@/components/VideoConference";

const ReviewPage = () => {
  const { isLoaded, userId } = useAuth();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    // This should theoretically never happen due to middleware protection
    return <div>Please sign in to access this page</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 h-screen flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl -mt-28">
        <VideoConference />
      </div>
    </div>
  );
};

export default ReviewPage;
