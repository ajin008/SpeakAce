import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "This is a dummy API response",
    dummyData: {
      question: "What is 2+2?",
      answer: "4",
    },
  });
}
