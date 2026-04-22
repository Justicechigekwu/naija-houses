"use client";
import { useState } from "react";
import { Star } from "lucide-react";

export default function StarRating({
  value,
  onChange,
  size = 28,
}: {
  value: number;
  onChange?: (val: number) => void;
  size?: number;
}) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = (hover ?? value) >= star;

        return (
          <button
            key={star}
            type="button"
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
            onClick={() => onChange && onChange(star)}
            className="rounded-md transition hover:scale-105"
          >
            <Star
              size={size}
              className={`transition-colors ${
                active
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}