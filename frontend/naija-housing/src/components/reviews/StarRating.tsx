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
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`cursor-pointer transition-colors ${
            (hover ?? value) >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
          }`}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}
          onClick={() => onChange && onChange(star)}
        />
      ))}
    </div>
  );
}
