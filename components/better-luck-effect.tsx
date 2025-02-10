"use client";

import { useEffect, useState } from "react";

interface BetterLuckEffectProps {
  isActive: boolean;
}

export function BetterLuckEffect({ isActive }: BetterLuckEffectProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isActive) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isActive]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="text-4xl font-bold text-yellow-500 animate-bounce">
        Better luck next time!
      </div>
    </div>
  );
}
