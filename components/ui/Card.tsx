"use client";

import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export default function Card({ children, className = "", onClick }: Props) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`glass-card p-4 cursor-pointer transition-all duration-200 ${className}`}
    >
      {children}
    </motion.div>
  );
}
