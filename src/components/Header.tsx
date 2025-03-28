"use client";
import { FC, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";
import AboutModal from "./AboutModal";
import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
  SignUpButton,
} from "@clerk/nextjs";

import { useRouter } from "next/navigation";

const Header: FC = () => {
  const [showAboutModal, setShowAboutModal] = useState(false);

  const router = useRouter();

  const handleUpgradeToPremium = () => {
    router.push("/upgrade");
    console.log("Upgrade to Premium clicked");
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
            speakAce
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

          <motion.button
            onClick={handleUpgradeToPremium}
            className="flex items-center gap-2 px-4 py-2 text-[#F4AF29] rounded-full cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Crown size={20} strokeWidth={2.5} />
            <span className="hidden sm:inline">Upgrade</span>
          </motion.button>

          <SignedIn>
            <div className="flex items-center gap-4">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <div className="flex items-center gap-3">
              <SignInButton mode="modal">
                <motion.button
                  className="px-4 py-2 bg-[#7959D8] text-white rounded-full cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get In
                </motion.button>
              </SignInButton>
            </div>
          </SignedOut>
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
