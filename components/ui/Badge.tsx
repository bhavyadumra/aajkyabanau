"use client";

type Props = {
  children: React.ReactNode;
  variant?: "primary" | "accent" | "muted";
};

export default function Badge({ children, variant = "primary" }: Props) {
  const base = "px-2 py-1 rounded-full text-xs font-medium";
  const styles = {
    primary: "bg-primaryMid text-white",
    accent: "bg-accent text-white",
    muted: "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200",
  } as const;
  return <span className={`${base} ${styles[variant]}`}>{children}</span>;
}
