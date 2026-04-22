"use client";

type BadgeDotProps = {
  show?: boolean;
  className?: string;
};

export default function BadgeDot({
  show = false,
  className = "",
}: BadgeDotProps) {
  if (!show) return null;

  return (
    <span
      className={`absolute top-0 right-0 w-3 h-3 rounded-full bg-red-600 border-2 border-white ${className}`}
    />
  );
}