import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function POST(request: Request) {
  try {
    const { input, jobField } = await request.json();

    // Basic validation before calling Gemini
    if (!input || typeof input !== "string" || input.trim().length < 2) {
      return NextResponse.json(
        { isValid: false, message: "Input too short" },
        { status: 200 }
      );
    }

    // Clean the input
    const cleanInput = input.trim();

    // Construct a clear prompt
    const prompt = `
        Analyze this job field input for a mock interview platform.
        The user entered: "${cleanInput}"
        
        Is this a valid, professional job field or role?
        Respond ONLY with "valid" or "invalid" and a very brief reason (5-7 words).
        
        Examples of invalid inputs:
        - Nonsense: "asdf123"
        - Too vague: "job"
        - Offensive content
        
        Example responses:
        - "valid"
        - "invalid: too vague"
        - "invalid: not professional"
      `;

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim().toLowerCase();

    // Parse the response
    const isValid = text.startsWith("valid");
    const message = isValid ? "" : text.replace("invalid:", "").trim();

    return NextResponse.json({ isValid, message });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { isValid: false, message: "Validation service error" },
      { status: 500 }
    );
  }
}
