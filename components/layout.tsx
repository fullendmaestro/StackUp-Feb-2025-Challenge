"use client";

import Image from "next/image";
import { type ReactNode, useEffect, useRef } from "react";
import { Header } from "./header";
import type { VisibilityType } from "./visibility-selector";

interface LayoutProps {
  children: ReactNode;
  quizId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
}

export function Layout({
  children,
  quizId,
  selectedVisibilityType,
  isReadonly,
}: LayoutProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      console.log(audioRef.current);
      audioRef.current.volume = 0.2; // Set volume to 20%
      audioRef.current
        .play()
        .catch((error) => console.log("Audio playback failed:", error));
    }
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-[#E8F4FC] overflow-hidden flex items-center justify-center">
      <Header
        selectedVisibilityType={selectedVisibilityType}
        quizId={quizId}
        isReadonly={isReadonly}
      />
      <Image
        src="/quizy-background.svg"
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
      <audio ref={audioRef} src="/Walen - Gameboy (freetouse.com).mp3" loop />
    </div>
  );
}
