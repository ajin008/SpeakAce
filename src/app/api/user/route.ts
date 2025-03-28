import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { saveUserToFirestore } from "../../../lib/firebaseAdmin";

export async function GET() {
  console.log("GET /api/user called");
  const user = await currentUser();

  if (!user) {
    console.log("User not authenticated");
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  console.log("User data:", {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.primaryEmailAddress?.emailAddress,
  });

  try {
    console.log(`Saving user ${user.id} to Firestore`);
    await saveUserToFirestore(user);
    console.log(`User ${user.id} saved successfully`);
    return NextResponse.json({ message: "User data saved successfully" });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Failed to save user data" },
      { status: 500 }
    );
  }
}
