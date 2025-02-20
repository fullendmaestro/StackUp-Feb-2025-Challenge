"use client";

import type { User } from "next-auth";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Layout } from "@/components/layout";
import Image from "next/image";
import type { VisibilityType } from "./visibility-selector";
import { ConfettiEffect } from "./confetti-effect";
import { BetterLuckEffect } from "./better-luck-effect";
import { Question, Quiz } from "@/lib/db/schema";
import { QuizPreviewLayout } from "./quiz-preview-layout";

export function QuizLayout({
  quiz,
  initialQuestions,
  isReadonly,
  selectedVisibilityType,
  user,
}: {
  quiz: Quiz;
  initialQuestions: any[];
  isReadonly: boolean;
  selectedVisibilityType: VisibilityType;
  user: User | undefined;
}) {
  console.log("quiz", quiz);
  console.log("initialQuestions", initialQuestions);
  // initialQuestions || [],
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBetterLuck, setShowBetterLuck] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (isReadonly) {
      setShowCorrectAnswer(true);
    }
    console.log("questions", questions);
  }, [isReadonly, questions]);

  const sendAnswer = async () => {
    if (isReadonly) return;
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
          questionId: questions[currentQuestionIndex]?.id,
          answer: selectedAnswer,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit answer");
      }

      setIsSubmitting(false);
      return await response.json();
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchQuestion = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          quizId: quiz.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch question");
      }

      setIsLoading(false);
      return await response.json();
    } catch (error) {
      console.error("Error fetching question:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAndSetQuestion = async () => {
    const question = await fetchQuestion();
    if (question) {
      setQuestions((prev) => [...prev, question]);
    }
  };

  useEffect(() => {
    setQuestions(initialQuestions || []);

    if (Number(quiz.numQuestions) > initialQuestions.length) {
      fetchAndSetQuestion();
    } else {
      setShowPreview(true);
    }
    setCurrentQuestionIndex(questions.length);
  }, []);

  const handleSubmit = async () => {
    if (selectedAnswer === null || isReadonly) return;

    setShowCorrectAnswer(true);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect =
      currentQuestion &&
      selectedAnswer === currentQuestion.content.correctAnswer;
    setScore((prevScore) => prevScore + (isCorrect ? 1 : 0));

    await sendAnswer();

    const updatedQuestion = await sendAnswer();
    if (updatedQuestion) {
      setQuestions((prevQuestions) =>
        prevQuestions.map((q, index) =>
          index === currentQuestionIndex ? updatedQuestion : q,
        ),
      );
    }

    if (currentQuestionIndex === Number(quiz.numQuestions) - 1) {
      setShowResult(true);
      if (score / questions.length > 0.5) {
        setShowConfetti(true);
      } else {
        setShowBetterLuck(true);
      }
    } else {
      setTimeout(() => {
        setShowCorrectAnswer(false);
        setSelectedAnswer(null);
        setCurrentQuestionIndex((prev) => prev + 1);
      }, 2000);
    }

    if (questions.length < Number(quiz.numQuestions)) {
      await fetchAndSetQuestion();
    }
  };

  if (isLoading && questions.length === 0) {
    return (
      <Layout
        quizId={quiz.id}
        selectedVisibilityType={selectedVisibilityType}
        isReadonly={isReadonly}
        user={user}
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#2E7D32]" />
        </div>
      </Layout>
    );
  }

  if (showPreview) {
    return (
      <QuizPreviewLayout
        quiz={quiz}
        questions={questions}
        isReadonly={isReadonly}
        selectedVisibilityType={selectedVisibilityType}
        score={score}
        user={user}
      />
    );
  }

  return (
    <Layout
      quizId={quiz.id}
      selectedVisibilityType={selectedVisibilityType}
      isReadonly={isReadonly}
      user={user}
    >
      <div className="relative w-full max-w-4xl px-4">
        <Card className="mx-auto w-full max-w-2xl bg-white/95 p-8 backdrop-blur max-h-[80vh] overflow-y-auto">
          <div className="space-y-8">
            <div className="mb-4 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {quiz.numQuestions}
              </div>
              <div className="text-sm text-gray-500">
                Score: {score}/{questions.length}
              </div>
            </div>
            {!showResult && (
              <>
                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D32]"></div>
                  </div>
                ) : questions && questions[currentQuestionIndex] ? (
                  <>
                    <h2 className="text-center text-4xl font-bold text-[#2E7D32]">
                      {questions[currentQuestionIndex].content.question}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {questions[currentQuestionIndex].content.options.map(
                        (option, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedAnswer(index)}
                            disabled={showCorrectAnswer}
                            className={`w-full flex items-center gap-4 p-4 rounded-full transition-colors ${
                              selectedAnswer === index
                                ? showCorrectAnswer
                                  ? index ===
                                    questions[currentQuestionIndex].content
                                      .correctAnswer
                                    ? "bg-green-500 text-white"
                                    : "bg-red-500 text-white"
                                  : "bg-[#2E7D32] text-white"
                                : showCorrectAnswer &&
                                    index ===
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
                  </>
                ) : (
                  <div className="text-center text-2xl font-bold text-[#2E7D32]">
                    No question available.
                  </div>
                )}
                <div className="flex justify-center">
                  <button
                    onClick={handleSubmit}
                    disabled={
                      selectedAnswer === null ||
                      showCorrectAnswer ||
                      isReadonly ||
                      isSubmitting
                    }
                    className={`w-1/2 flex items-center justify-center gap-4 p-4 rounded-full transition-colors ${
                      selectedAnswer !== null &&
                      !showCorrectAnswer &&
                      !isReadonly &&
                      !isSubmitting
                        ? "bg-[#2E7D32] text-white"
                        : "bg-[#A5D6A7] hover:bg-[#81C784] text-black"
                    }`}
                  >
                    <span className="text-xl font-semibold text-[#E8F4FC]">
                      Submit Answer{" "}
                      {isSubmitting && (
                        <span className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2E7D32]"></span>
                      )}
                    </span>
                  </button>
                </div>
                {showCorrectAnswer &&
                  questions &&
                  questions[currentQuestionIndex] && (
                    <div className="mt-8 p-4 bg-[#E8F4FC] rounded-lg">
                      <h3 className="text-xl font-bold text-[#2E7D32] mb-2">
                        {selectedAnswer ===
                        questions[currentQuestionIndex].content.correctAnswer
                          ? "Correct!"
                          : "Incorrect"}
                      </h3>
                      <p>
                        {questions[currentQuestionIndex].content.explanation}
                      </p>
                    </div>
                  )}
              </>
            )}
            {showResult && (
              <div className="mt-8 p-6 bg-[#E8F4FC] text-center shadow-lg rounded-xl">
                <h3 className="text-3xl font-bold text-[#2E7D32] mb-4">
                  Final Score: {Math.round((score / questions.length) * 100)}%
                </h3>
                <p className="text-xl mb-4">
                  {score / questions.length > 0.5
                    ? "Congratulations! You did a great job!"
                    : "Keep practicing, you'll improve with time!"}
                </p>
                <p className="text-lg mb-4">
                  {score / questions.length > 0.5
                    ? "You have a good understanding of the material."
                    : "Don't worry, keep trying and you'll get better."}
                </p>
                <button
                  onClick={() => {
                    setShowResult(false);
                    setShowPreview(true);
                  }}
                  className="mt-4 px-6 py-3 bg-[#2E7D32] text-white rounded-full hover:bg-[#1B5E20] transition-colors text-lg font-semibold"
                >
                  Hide Result
                </button>
              </div>
            )}
          </div>
        </Card>
      </div>
      <ConfettiEffect isActive={showConfetti} />
      <BetterLuckEffect isActive={showBetterLuck} />
    </Layout>
  );
}
