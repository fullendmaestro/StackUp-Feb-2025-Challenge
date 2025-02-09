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
}

export function QuizLayout({
  question,
  options,
  onNext,
  onPrevious,
  onSubmit,
  currentQuestionIndex,
  totalQuestions,
}: QuizLayoutProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleSubmit = () => {
    if (selectedAnswer) {
      onSubmit(selectedAnswer);
      setSelectedAnswer(null);
    }
  };

  return (
    <div className="relative w-full max-w-4xl px-4">
      {/* Navigation - Previous */}
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
          <h2 className="text-center text-4xl font-bold text-[#2E7D32]">
            {question}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedAnswer(option)}
                className={`w-full flex items-center gap-4 p-4 rounded-full transition-colors ${
                  selectedAnswer === option
                    ? "bg-[#2E7D32] text-white"
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
              disabled={!selectedAnswer}
              className={`w-1/2 flex items-center justify-center gap-4 p-4 rounded-full transition-colors ${
                selectedAnswer
                  ? "bg-[#2E7D32] text-white"
                  : "bg-[#A5D6A7] hover:bg-[#81C784] text-black"
              }`}
            >
              <span className="text-xl font-semibold">Submit Answer</span>
            </button>
          </div>
        </div>
      </Card>

      {/* Navigation - Next */}
      {currentQuestionIndex < totalQuestions - 1 && (
        <button
          onClick={onNext}
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
