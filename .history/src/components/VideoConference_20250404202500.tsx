"use client";
import React, { useState, useEffect } from "react";
import VoiceControl from "./VoiceControl";
import Image from "next/image";
import img from "../../public/Cartoon Style Robot.jpg";

interface VideoConferenceProps {
  userId: string;
  userName: string;
  jobField: string;
}

const VideoConference: React.FC<VideoConferenceProps> = ({
  userId,
  userName,
  jobField,
}) => {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    setIsConnected(true);
  };

  return (
    <div className="w-full lg:w-[90%] lg:max-w-5xl h-[70vh] sm:h-[80vh] lg:h-[85vh] rounded-lg flex flex-col justify-between p-4 mx-auto">
      {/* Video Feed Area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full lg:w-[95%] lg:max-w-[1100px] h-full bg-[#ffffff] rounded-lg flex items-center justify-center border-2 border-[#dddddd]">
          <span className="text-gray-500 text-lg">
            <Image
              src={img}
              alt="logo"
              width={150}
              height={150}
              className="object-contain"
            />
          </span>
        </div>
      </div>

      {/* Conditionally render Connect Button or Voice Control */}
      <VoiceControl
        userId={userId}
        userName={userName}
        jobField={jobField}
        onStart={() => console.log("Interview started")}
        onCancel={() => {
          console.log("Interview cancelled");
          setIsConnected(false); // Reset to show Connect button again
        }}
      />
    </div>
  );
};

export default VideoConference;
