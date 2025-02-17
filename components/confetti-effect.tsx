"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";

const Confetti = dynamic(() => import("react-confetti"), {
  ssr: false,
});

export function ConfettiEffect({ isActive }: { isActive: boolean }) {
  const [windowDimension, setWindowDimension] = useState({
    width: 0,
    height: 0,
  });
  const showConfetti = isActive;

  useEffect(() => {
    const updateDimension = () => {
      setWindowDimension({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimension();
    window.addEventListener("resize", updateDimension);

    return () => {
      window.removeEventListener("resize", updateDimension);
    };
  }, []);

  if (!showConfetti) return null;

  return (
    <Confetti
      width={windowDimension.width}
      height={windowDimension.height}
      numberOfPieces={200}
      recycle={false}
    />
  );
}
