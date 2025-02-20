"use client";

import type { User } from "next-auth";
import Image from "next/image";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { Header } from "./header";
import type { VisibilityType } from "./visibility-selector";

interface LayoutProps {
  children: ReactNode;
  quizId: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
  user: User | undefined;
}

export function Layout({
  children,
  quizId,
  selectedVisibilityType,
  isReadonly,
  user,
}: LayoutProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMusicOn, setIsMusicOn] = useState(true);

  const handleToggleMusic = () => {
    setIsMusicOn((prev) => !prev);
    if (audioRef.current) {
      if (isMusicOn) {
        audioRef.current.pause();
      } else {
        audioRef.current
          .play()
          .catch((error) => console.log("Audio playback failed:", error));
      }
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2; // Set volume to 20%
      if (isMusicOn) {
        audioRef.current
          .play()
          .catch((error) => console.log("Audio playback failed:", error));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isMusicOn]);

  return (
    <div className="relative min-h-screen w-full bg-[#E8F4FC] overflow-hidden flex items-center justify-center">
      <Header
        selectedVisibilityType={selectedVisibilityType}
        quizId={quizId}
        isReadonly={isReadonly}
        user={user}
        isMusicOn={isMusicOn}
        onToggleMusic={handleToggleMusic}
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
