import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../../../../lib/firebaseAdmin";

// Initialize with the correct environment variable name
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(request: Request) {
  console.log("POST /api/vapi/generate is triggering");

  try {
    // Parse the request body
    const { techStack, userId } = await request.json();
    console.log("tech stack and userId received:", techStack, userId);

    // Validate the input
    if (!techStack || !userId) {
      return NextResponse.json(
        { success: false, error: "Missing techStack or userId" },
        { status: 400 }
      );
    }

    // Verify API key is loaded
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      throw new Error("Google API key is not configured");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate exactly 5 interview questions about ${techStack.trim()} as a JSON array.
      Format must be: ["question 1", "question 2", "question 3", "question 4", "question 5"]
      Do not include any additional text or explanations.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse and validate questions
    let questions;
    try {
      const jsonMatch = text.match(/\[.*\]/s);
      if (!jsonMatch) throw new Error("No valid JSON array found in response");
      questions = JSON.parse(jsonMatch[0]);

      // Fixed syntax error here - added missing parenthesis
      if (!Array.isArray(questions)) {
        throw new Error("Generated questions are not in array format");
      }
    } catch (parseError) {
      console.error("Failed to parse questions:", text);
      throw new Error("Invalid question format from AI");
    }

    // Save to Firestore
    const interviewRef = await db
      .collection("users")
      .doc(userId)
      .collection("interviews")
      .add({
        techStack: techStack.split(","),
        questions,
        userId,
        finalized: true,
        createdAt: new Date().toISOString(),
      });

    return NextResponse.json({
      success: true,
      interviewId: interviewRef.id,
      questions,
    });
  } catch (error) {
    console.error("Error in /api/vapi/generate:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate or save interview",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
