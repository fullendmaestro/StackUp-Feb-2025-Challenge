"use client";

import type { User } from "next-auth";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Layout } from "@/components/layout";
import Image from "next/image";
import type { VisibilityType } from "./visibility-selector";
import { Question, Quiz } from "@/lib/db/schema";
import { calculateScore } from "@/lib/utils";

export function QuizPreviewLayout({
  quiz,
  questions,
  isReadonly,
  selectedVisibilityType,
  score: initialScore,
  user,
}: {
  quiz: Quiz;
  questions: Question[];
  isReadonly: boolean;
  selectedVisibilityType: VisibilityType;
  score: number;
  user: User | undefined;
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(initialScore);

  useEffect(() => {
    if (initialScore === 0 || initialScore === null) {
      const calculatedScore = calculateScore(questions);
      setScore(calculatedScore);
    }
  }, [initialScore, questions]);

  const handlePrevious = () => {
    setCurrentQuestionIndex((prev) => prev - 1);
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prev) => prev + 1);
  };

  return (
    <Layout
      quizId={quiz.id}
      selectedVisibilityType={selectedVisibilityType}
      isReadonly={isReadonly}
      user={user}
    >
      <div className="relative w-full max-w-4xl px-4">
        {currentQuestionIndex > 0 && (
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 transform"
            aria-label="Previous question"
          >
            <Image
              src="/quizy-previous.svg"
              alt="Previous"
              width={48}
              height={48}
            />
          </button>
        )}

        <Card className="mx-auto w-full max-w-2xl bg-white/95 p-8 backdrop-blur max-h-[80vh] overflow-y-auto">
          <div className="space-y-8">
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </div>
              <div className="text-sm text-gray-500">
                Score: {score}/{questions.length}
              </div>
            </div>

            {questions && questions[currentQuestionIndex] ? (
              <>
                <h2 className="text-center text-4xl font-bold text-[#2E7D32]">
                  {questions[currentQuestionIndex].content.question}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {questions[currentQuestionIndex].content.options.map(
                    (option, index) => (
                      <button
                        key={index}
                        disabled={true}
                        className={`w-full flex items-center gap-4 p-4 rounded-full transition-colors ${
                          Number(
                            questions[currentQuestionIndex].submitedAnswer,
                          ) === index
                            ? Number(
                                questions[currentQuestionIndex].submitedAnswer,
                              ) ===
                              questions[currentQuestionIndex].content
                                .correctAnswer
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                            : index ===
                                questions[currentQuestionIndex].content
                                  .correctAnswer
                              ? "bg-green-500 text-white"
                              : "bg-[#E8F4FC] text-[#2E7D32] hover:bg-[#C8E6C9]"
                        }`}
                      >
                        <span className="w-10 h-10 flex items-center justify-center rounded-full">
                          {String.fromCharCode(65 + index)} .
                        </span>
                        <span className="text-xl">{option}</span>
                      </button>
                    ),
                  )}
                </div>
                <div className="mt-8 p-4 bg-[#E8F4FC] rounded-lg">
                  <h3 className="text-xl font-bold text-[#2E7D32] mb-2">
                    {Number(questions[currentQuestionIndex].submitedAnswer) ===
                    questions[currentQuestionIndex].content.correctAnswer
                      ? "Correct!"
                      : "Incorrect"}
                  </h3>
                  <p>{questions[currentQuestionIndex].content.explanation}</p>
                </div>
              </>
            ) : (
              <div className="text-center text-2xl font-bold text-[#2E7D32]">
                No question available.
              </div>
            )}
          </div>
        </Card>

        {currentQuestionIndex < questions.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 transform"
            aria-label="Next question"
          >
            <Image src="/quizy-next.svg" alt="Next" width={48} height={48} />
          </button>
        )}
      </div>
    </Layout>
  );
}
