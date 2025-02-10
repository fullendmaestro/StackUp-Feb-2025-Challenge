"use client";

import Image from "next/image";
import { Card } from "@/components/ui/card";
import { useState } from "react";

interface QuizLayoutProps {
  question: string;
  options: string[];
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: (answer: string) => void;
  currentQuestionIndex: number;
  totalQuestions: number;
  explanation: string;
  loading: boolean;
  showCorrectAnswer: boolean;
  correctAnswer: number;
  score: number | null;
}

export function QuizLayout({
  question,
  options,
  onNext,
  onPrevious,
  onSubmit,
  currentQuestionIndex,
  totalQuestions,
  explanation,
  loading,
  showCorrectAnswer,
  correctAnswer,
  score,
}: QuizLayoutProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSubmit = () => {
    if (selectedAnswer) {
      onSubmit(selectedAnswer);
      setShowExplanation(true);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    onNext();
  };

  return (
    <div className="relative w-full max-w-4xl px-4">
      {currentQuestionIndex > 0 && (
        <button
          onClick={onPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 transform"
          aria-label="Previous question"
        >
          <Image
            src="https://qgame3ccfcbtygae.public.blob.vercel-storage.com/quizy-previous-eT3zLo3euZVL292TUvvGRh3zejIvd5.svg"
            alt="Previous"
            width={48}
            height={48}
          />
        </button>
      )}

      {/* Question Card */}
      <Card className="mx-auto w-full max-w-2xl bg-white/95 p-8 backdrop-blur">
        <div className="space-y-8">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D32]"></div>
            </div>
          ) : (
            <h2 className="text-center text-4xl font-bold text-[#2E7D32]">
              {question}
            </h2>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(option)}
                disabled={showCorrectAnswer}
                className={`w-full flex items-center gap-4 p-4 rounded-full transition-colors ${
                  selectedAnswer === option
                    ? showCorrectAnswer
                      ? index === correctAnswer
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-[#2E7D32] text-white"
                    : showCorrectAnswer && index === correctAnswer
                      ? "bg-green-500 text-white"
                      : "bg-[#E8F4FC] text-[#2E7D32] hover:bg-[#C8E6C9]"
                }`}
              >
                <span className="w-10 h-10 flex items-center justify-center rounded-full">
                  {String.fromCharCode(65 + index)} .
                </span>
                <span className="text-xl">{option}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer || showCorrectAnswer}
              className={`w-1/2 flex items-center justify-center gap-4 p-4 rounded-full transition-colors ${
                selectedAnswer && !showCorrectAnswer
                  ? "bg-[#2E7D32] text-white"
                  : "bg-[#A5D6A7] hover:bg-[#81C784] text-[#E8F4FC]"
              }`}
            >
              <span className="text-xl font-semibold">Submit Answer</span>
            </button>
          </div>
          {(showExplanation || showCorrectAnswer) && (
            <div className="mt-8 p-4 bg-[#E8F4FC] rounded-lg">
              <h3 className="text-xl font-bold text-[#2E7D32] mb-2">
                Explanation:
              </h3>
              <p>{explanation}</p>
            </div>
          )}
          {score !== null && (
            <div className="mt-8 p-4 bg-[#E8F4FC] rounded-lg text-center">
              <h3 className="text-2xl font-bold text-[#2E7D32] mb-2">
                Final Score: {Math.round(score * 100)}%
              </h3>
              <p className="text-lg">
                {score > 0.5
                  ? "Congratulations!"
                  : "Keep practicing, you'll improve!"}
              </p>
            </div>
          )}
        </div>
      </Card>

      {/* Navigation - Next */}
      {currentQuestionIndex < totalQuestions - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 transform"
          aria-label="Next question"
        >
          <Image
            src="https://qgame3ccfcbtygae.public.blob.vercel-storage.com/quizy-next-CcsT5w07qSoTeBziHrW8peSMV8OkxL.svg"
            alt="Next"
            width={48}
            height={48}
          />
        </button>
      )}
    </div>
  );
}
