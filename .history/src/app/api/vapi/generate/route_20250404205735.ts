import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/firebaseAdmin";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(request: Request) {
  try {
    const {
      userId,
      userName,
      jobField,
      numQuestions,
      experienceLevel,
      interviewType,
    } = await request.json();

    // Validate input
    if (
      !userId ||
      !jobField ||
      !numQuestions ||
      !experienceLevel ||
      !interviewType
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate questions with Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate ${numQuestions} ${interviewType} interview questions for a ${jobField} position, tailored to a ${experienceLevel} level candidate. Return them as a JSON array of strings.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let questions = JSON.parse(response.text());

    // Ensure questions is an array of strings
    if (!Array.isArray(questions)) {
      questions = [response.text()]; // Fallback if JSON parsing fails
    }

    // Store interview data in Firebase
    const interviewRef = db.collection("interviews").doc(userId);
    await interviewRef.set(
      {
        userId,
        userName,
        jobField,
        numQuestions,
        experienceLevel,
        interviewType,
        questions,
        answers: [],
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );

    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
