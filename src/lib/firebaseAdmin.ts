// Use either this (default import):
import admin from "firebase-admin";
// OR this (namespace import):
// import * as admin from "firebase-admin";

import { User } from "@clerk/nextjs/server";

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      : null;

    if (!serviceAccount) {
      throw new Error("Firebase service account not configured");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    throw error;
  }
}

export const db = admin.firestore();

export async function saveUserToFirestore(user: User) {
  try {
    const userDocRef = db.collection("users").doc(user.id);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      await userDocRef.set({
        userId: user.id,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      console.log(`User ${user.id} saved to Firestore`);
    } else {
      await userDocRef.update({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        updatedAt: new Date().toISOString(),
      });
      console.log(`User ${user.id} updated in Firestore`);
    }
  } catch (error) {
    console.error("Error saving user to Firestore:", error);
    throw new Error("Failed to save user to Firestore");
  }
}
