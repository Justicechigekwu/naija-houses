"use client";

import { ReactNode } from "react";
import CountBadge from "@/components/ui/CountBadge";
import BadgeDot from "@/components/ui/BadgeDot";

type IconWithBadgeProps = {
  children: ReactNode;
  count?: number;
  showDot?: boolean;
  className?: string;
  badgeClassName?: string;
};

export default function IconWithBadge({
  children,
  count = 0,
  showDot = false,
  className = "",
  badgeClassName = "",
}: IconWithBadgeProps) {
  return (
    <div className={`relative inline-flex ${className}`}>
      {children}
      {count > 0 ? (
        <CountBadge count={count} className={badgeClassName} />
      ) : (
        <BadgeDot show={showDot} className={badgeClassName} />
      )}
    </div>
  );
}