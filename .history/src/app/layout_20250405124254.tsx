import { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Header from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SpeakAce",
  description: "AI powered Reviewer for SelfLearning",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider
      afterSignInUrl="/"
      afterSignUpUrl="/"
      appearance={{
        variables: {
          colorPrimary: "#7959D8",
          colorText: "#333",
          colorBackground: "#faf8fb",
          colorInputBackground: "#ffffff",
          colorInputText: "#333",
          borderRadius: "0.5rem",
          fontFamily: "'Geist', sans-serif",
        },
        elements: {
          rootBox: "w-full max-w-md",
          card: "shadow-lg border border-gray-200 bg-[#faf8fb] p-6 rounded-lg",
          headerTitle: "text-2xl font-bold text-[#333]",
          headerSubtitle: "text-gray-600 mb-6",
          formFieldInput:
            "border-gray-300 focus:border-[#7959D8] focus:ring-[#7959D8] rounded-lg p-2",
          formButtonPrimary:
            "bg-[#7959D8] hover:bg-[#6a4bc7] text-white font-semibold rounded-full py-2",
          socialButtonsBlockButton:
            "border-gray-300 hover:bg-gray-50 rounded-lg text-gray-700",
          footerActionText: "text-gray-600",
          footerActionLink: "text-[#7959D8] hover:text-[#6a4bc7] font-semibold",
          modalBackdrop: "items-start pt-28", // Adds padding-top to move modal down
          modalContent: "mt-0",
        },
      }}
    >
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Header />
          <Toaster position="top-right" />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
