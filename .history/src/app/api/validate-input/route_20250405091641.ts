import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  console.log("Received request to validate input");
  const { input, jobField } = await request.json();
  console.log("input and jobField:", input, jobField);
  try {
    const genAI = new GoogleGenerativeAI(
      process.env.GOOGLE_GENERATIVE_AI_API_KEY!
    );
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Analyze this job field input for a mock interview platform. 
      The user entered "${input}" for the field "${jobField}".
      
      Is this a valid, professional job field or role? 
      Respond ONLY with "valid" or "invalid" and a very brief reason (5-7 words).
      
      Examples of invalid inputs:
      - Nonsense: "asdf123"
      - Too vague: "job"
      - Offensive content
      
      Example responses:
      - "valid"
      - "invalid: too vague"
      - "invalid: not a real job"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim().toLowerCase();

    return NextResponse.json({
      isValid: text.startsWith("valid"),
      message: text.startsWith("invalid")
        ? text.replace("invalid:", "").trim()
        : "",
    });
  } catch (error) {
    return NextResponse.json({ error: "Validation failed" }, { status: 500 });
  }
}
