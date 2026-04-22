"use client";

import { ReactNode, useEffect, useState } from "react";
import PageLoader from "./PageLoader";

type PageReadyLoaderProps = {
  children: ReactNode;
  ready: boolean;
  minDuration?: number;
  timeoutDuration?: number;
};

export default function PageReadyLoader({
  children,
  ready,
  minDuration = 700,
  timeoutDuration = 5000,
}: PageReadyLoaderProps) {
  const [minTimeDone, setMinTimeDone] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  useEffect(() => {
    setMinTimeDone(false);
    setHidden(false);
    setTimedOut(false);

    const minTimer = setTimeout(() => {
      setMinTimeDone(true);
    }, minDuration);

    const timeoutTimer = setTimeout(() => {
      setTimedOut(true);
    }, timeoutDuration);

    return () => {
      clearTimeout(minTimer);
      clearTimeout(timeoutTimer);
    };
  }, [minDuration, timeoutDuration]);

  useEffect(() => {
    if (ready && minTimeDone) {
      const exitTimer = setTimeout(() => {
        setHidden(true);
        setTimedOut(false);
      }, 100);

      return () => clearTimeout(exitTimer);
    }
  }, [ready, minTimeDone]);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <>
      {!hidden && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F5F5F5]">
          <div className="flex flex-col items-center justify-center px-6 text-center">
            <PageLoader visible={!timedOut} />

            {timedOut && !ready && (
              <div className="flex flex-col items-center">
                <p className="text-[#8A715D] text-base sm:text-lg font-medium">
                  Check your internet connection
                </p>

                <p className="mt-2 text-sm text-gray-500">
                  The page is taking longer than expected to load.
                </p>

                <button
                  onClick={handleRetry}
                  className="mt-6 rounded-lg bg-[#8A715D] px-5 py-3 text-white transition hover:bg-[#735d4d]"
                >
                  Click to retry
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {children}
    </>
  );
}