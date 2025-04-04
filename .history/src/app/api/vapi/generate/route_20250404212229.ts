import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "@/lib/firebaseAdmin";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.answer && body.question) {
      // Handle answer submission
      const { userId, answer, question } = body;
      const interviewRef = db.collection("interviews").doc(userId);
      await interviewRef.update({
        answers: admin.firestore.FieldValue.arrayUnion({
          question,
          answer,
          timestamp: new Date().toISOString(),
        }),
      });
      return NextResponse.json({ message: "Answer saved" });
    }

    // Existing question generation logic
    const {
      userId,
      userName,
      jobField,
      numQuestions,
      experienceLevel,
      interviewType,
    } = body;

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

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `Generate ${numQuestions} ${interviewType} interview questions for a ${jobField} position, tailored to a ${experienceLevel} level candidate. Return them as a JSON array of strings.`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let questions = JSON.parse(response.text());

    if (!Array.isArray(questions)) {
      questions = [response.text()];
    }

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
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
