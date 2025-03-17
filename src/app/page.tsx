import InterviewHeading from "@/components/InterviewHeading";
import VoiceAssistant from "@/components/VoiceAssistant";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen -mt-24">
      <div className="mb-16">
        <VoiceAssistant />
      </div>
      <InterviewHeading />
    </div>
  );
}
