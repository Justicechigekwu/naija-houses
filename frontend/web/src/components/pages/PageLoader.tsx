"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type PageLoaderProps = {
  visible: boolean;
  text?: string;
};

export default function PageLoader({
  visible,
  text = "Trade smart. Live better.",
}: PageLoaderProps) {
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    if (visible) {
      setShowTagline(false);

      timer = setTimeout(() => {
        setShowTagline(true);
      }, 150);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [visible]);

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-[#F5F5F5] transition-opacity duration-500 ${
        visible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex flex-col items-center justify-center">
        <div
          className={`relative h-36 w-36 sm:h-40 sm:w-40 overflow-hidden rounded-[28px] transition-all duration-700 ${
            visible ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <Image
            src="/velora.png"
            alt="Velora logo"
            fill
            priority
            sizes="160px"
            className="object-contain scale-[2.2] animate-[veloraPulse_1.8s_ease-in-out_infinite]"
          />
        </div>

        <p
          className={`mt-6 text-center text-sm sm:text-base tracking-[0.18em] text-[#8A715D] transition-all duration-700 ${
            showTagline ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          {text}
        </p>
      </div>
    </div>
  );
}