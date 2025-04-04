import { NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { db } from "@/lib/firebaseAdmin";

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received payload from Vapi:", body);

    const { userName, age } = body.data || body;

    if (!userName || !age) {
      return NextResponse.json(
        { error: "Missing userName or age" },
        { status: 400 }
      );
    }

    console.log(`User ${userName} said their age is: ${age}`);

    return NextResponse.json({
      message: "Age received successfully",
      userName,
      age,
    });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Failed to process request", details: error.message },
      { status: 500 }
    );
  }
}
