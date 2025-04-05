import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/firebaseAdmin";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(request: Request) {
  console.log("Received request to /api/vapi/generate");
  try {
    const body = await request.json();
    console.log("Received payload from Vapi:", body);

    const {
      userId,
      userName,
      jobField,
      techStack,
      experienceLevel,
      numQuestions,
      questions,
      answers,
    } = body;

    if (userId && questions && answers) {
      // Store interview data in Firebase
      await db.collection("interviews").doc(userId).set(
        {
          userName,
          jobField,
          techStack,
          experienceLevel,
          numQuestions,
          questions,
          answers,
          timestamp: new Date().toISOString(),
        },
        { merge: true }
      );

      console.log(`Interview data saved for user ${userId}`);

      // Generate feedback using Gemini
      const prompt = `
        Generate feedback for a mock interview based on the following:
        - Job Field: ${jobField}
        - Tech Stack: ${techStack}
        - Experience Level: ${experienceLevel}
        - Questions and Answers:
        ${questions
          .map(
            (q: string, index: number) =>
              `${q}: ${answers[index] || "No answer"}`
          )
          .join("\n")}

        Provide a concise feedback summary (100-150 words) including strengths, areas for improvement, and suggestions. Use a professional tone.
      `;
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(prompt);
      const feedback = result.text().trim();

      console.log("Generated feedback:", feedback);

      // Update Firebase with feedback
      await db.collection("interviews").doc(userId).update({
        feedback,
        feedbackTimestamp: new Date().toISOString(),
      });

      console.log(`Feedback saved for user ${userId}`);
      return NextResponse.json({
        message: "Interview data and feedback saved successfully",
      });
    }

    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: error.message },
      { status: 500 }
    );
  }
}
