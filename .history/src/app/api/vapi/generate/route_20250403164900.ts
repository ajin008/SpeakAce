import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/firebaseAdmin";

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(request: Request) {
  try {
    console.log("Received POST request to /api/vapi/generate");
    // 1. Extract and validate data
    const body = await request.json();
    const { interviewType, experienceLevel, amount, jobField, userId } = body;

    console.log("Received request body:", body);

    // Validate required fields
    const missingFields = [];
    if (!interviewType) missingFields.push("interviewType");
    if (!experienceLevel) missingFields.push("experienceLevel");
    if (amount === undefined || amount === null) missingFields.push("amount");
    if (!jobField) missingFields.push("jobField");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
          receivedFields: body,
        },
        { status: 400 }
      );
    }

    // 2. Generate questions with Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      Create ${amount} interview questions for a ${experienceLevel} level candidate 
      applying for a position in ${jobField}. The interview type is ${interviewType}.
      
      Each question should be challenging but appropriate for the experience level.
      Format the response as a valid JSON array of objects, where each object has:
      - "question": the interview question text
      - "expectedTopics": array of key topics the answer should cover
      - "difficulty": a rating from 1-5
      
      Example format:
      [
        {
          "question": "Can you describe a challenging project you worked on?",
          "expectedTopics": ["Problem solving", "Technical skills", "Teamwork"],
          "difficulty": 3
        }
      ]
    `;

    console.log("Making Gemini API request with prompt:", prompt);

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    console.log("Received raw response from Gemini:", responseText);

    // 3. Parse and validate response
    let questions;
    try {
      questions = JSON.parse(responseText);
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("Empty or invalid question array");
      }
    } catch (error) {
      console.error("Failed to parse Gemini response:", responseText);
      throw new Error("Invalid question format from AI");
    }

    console.log("Successfully parsed questions:", questions);

    // 4. Store in Firebase
    try {
      const interviewRef = db.collection("interviews").doc();
      await interviewRef.set({
        userId: userId || "unknown",
        jobField,
        interviewType,
        experienceLevel,
        amount,
        questions,
        createdAt: new Date().toISOString(),
      });
      console.log("Saved interview to Firebase with ID:", interviewRef.id);
    } catch (dbError) {
      console.error("Firebase error:", dbError);
      // Continue process - don't fail if DB storage fails
    }

    // 5. Return success
    return NextResponse.json({
      success: true,
      questionsCount: questions.length,
      questions,
    });
  } catch (error) {
    console.error("API Error:", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: false,
        error: "Interview generation failed",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      },
      { status: 500 }
    );
  }
}
