"use client";

import { motion } from "framer-motion";

type Props = {
  icon: React.ReactNode;
  onClick?: () => void;
  tooltip?: string;
};

export default function IconButton({ icon, onClick, tooltip }: Props) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-sm font-medium"
      title={tooltip}
    >
      {icon}
    </motion.button>
  );
}
