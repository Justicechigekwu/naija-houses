"use client";

type CountBadgeProps = {
  count?: number;
  max?: number;
  className?: string;
};

export default function CountBadge({
  count = 0,
  max = 9,
  className = "",
}: CountBadgeProps) {
  if (!count || count <= 0) return null;

  return (
    <span
      className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-semibold flex items-center justify-center leading-none ${className}`}
    >
      {count > max ? `${max}+` : count}
    </span>
  );
}