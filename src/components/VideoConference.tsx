import React from "react";
import VoiceControl from "./VoiceControl";
import Image from "next/image";
import img from "../../public/Cartoon Style Robot.jpg";

const VideoConference: React.FC = () => {
  return (
    <div className="w-full lg:w-[90%] lg:max-w-5xl h-[70vh] sm:h-[80vh] lg:h-[85vh] rounded-lg flex flex-col justify-between p-4 mx-auto">
      {/* Video Feed Area */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full lg:w-[95%] lg:max-w-[1100px] h-full bg-[#ffffff] rounded-lg flex items-center justify-center border-2 border-[#dddddd]">
          <span className="text-gray-500 text-lg">
            <Image
              src={img}
              alt="logo"
              width={150} // Set the desired width
              height={150} // Set the desired height
              className="object-contain"
            />
          </span>
        </div>
      </div>

      {/* Voice Control Section */}
      <div className="flex justify-center items-center mt-4">
        <VoiceControl />
      </div>
    </div>
  );
};

export default VideoConference;
