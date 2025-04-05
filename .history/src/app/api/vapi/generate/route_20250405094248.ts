import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/firebaseAdmin";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(request: Request) {
  console.log("received request to /api/vapi/generate");
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

    if (
      userId &&
      userName &&
      jobField &&
      techStack &&
      experienceLevel &&
      numQuestions &&
      !questions
    ) {
      // Generate interview questions
      const prompt = `Generate ${numQuestions} interview questions for a ${experienceLevel} ${jobField} developer with a tech stack of ${techStack}. Return the questions as an array of strings.`;
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(prompt);
      const generatedQuestions = result.response
        .text()
        .replace(/^\s*[\[\{].*?[\]\}]\s*$/, "") // Remove array notation if present
        .split("\n")
        .map((q) => q.trim())
        .filter((q) => q);

      console.log("Generated questions:", generatedQuestions);
      return NextResponse.json({ questions: generatedQuestions });
    } else if (userId && questions && answers) {
      // Store questions and answers in Firebase
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
      return NextResponse.json({
        message: "Interview data saved successfully",
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
