"use client";
import Image from "next/image";
import { FC, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import AboutModal from "./AboutModal";
import { signIn, signOut, useSession } from "next-auth/react";
import { toast } from "sonner";

const Header: FC = () => {
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // State for dropdown visibility
  const { data: session } = useSession();

  console.log("Session Data:", session); // Log session data for debugging

  const handleGoogleSignIn = async () => {
    try {
      await signIn("google", { callbackUrl: "/" });
    } catch (error) {
      toast.error("Authentication failed");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: "/" }); // Redirect to homepage after logout
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <header className="w-full py-4 px-6 bg-white">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <motion.div
            className="text-2xl font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            speakace
          </motion.div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setShowAboutModal(true)}
            className="hover:text-blue-500 transition-colors"
          >
            About
          </button>
          {session ? (
            <div className="relative">
              {/* Profile Icon with Dropdown */}
              <div
                className="relative w-10 h-10 rounded-full overflow-hidden cursor-pointer"
                onClick={() => setShowDropdown(!showDropdown)} // Toggle dropdown
              >
                <Image
                  src={session.user?.image || "/user_8763604.png"} // Fixed image path
                  alt="Profile"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <motion.button
              className="px-4 py-2 bg-[#7959D8] text-white rounded-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGoogleSignIn}
            >
              Get In
            </motion.button>
          )}
        </div>
      </div>
      {/* About Modal */}
      {showAboutModal && (
        <AboutModal onClose={() => setShowAboutModal(false)} />
      )}
    </header>
  );
};

export default Header;
