"use client";

import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
};

export default function Button({
  children,
  onClick,
  className = "",
  type = "button",
}: Props) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`
        px-6 py-3 rounded-lg
        bg-gradient-to-r from-primaryStart to-primaryEnd
        text-white font-medium tracking-wide
        shadow-lg hover:shadow-xl
        transition-all duration-200
        ${className}
      `}
    >
      {children}
    </motion.button>
  );
}
