"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import { QuizLayout } from "@/components/quiz-layout";
import { Layout } from "@/components/layout";
import dynamic from "next/dynamic";
const ConfettiEffect = dynamic(
  () =>
    import("@/components/confetti-effect").then((mod) => mod.ConfettiEffect),
  {
    ssr: false,
  },
);
import { BetterLuckEffect } from "@/components/better-luck-effect";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: number;
  explanation: string;
}

const mathTopics = [
  {
    label: "Number Operations",
    value: "number-operations",
    children: [
      { label: "Addition and Subtraction", value: "addition-subtraction" },
      {
        label: "Multiplication and Division",
        value: "multiplication-division",
      },
      { label: "Fractions", value: "fractions" },
      { label: "Decimals", value: "decimals" },
      { label: "Percentages", value: "percentages" },
    ],
  },
  {
    label: "Algebra",
    value: "algebra",
    children: [
      { label: "Linear Equations", value: "linear-equations" },
      { label: "Quadratic Equations", value: "quadratic-equations" },
      { label: "Inequalities", value: "inequalities" },
      { label: "Systems of Equations", value: "systems-of-equations" },
      { label: "Polynomials", value: "polynomials" },
    ],
  },
  {
    label: "Geometry",
    value: "geometry",
    children: [
      { label: "Angles", value: "angles" },
      { label: "Triangles", value: "triangles" },
      { label: "Circles", value: "circles" },
      { label: "Area and Perimeter", value: "area-perimeter" },
      { label: "Volume and Surface Area", value: "volume-surface-area" },
    ],
  },
  {
    label: "Trigonometry",
    value: "trigonometry",
    children: [
      {
        label: "Right Triangle Trigonometry",
        value: "right-triangle-trigonometry",
      },
      { label: "Sine and Cosine Rules", value: "sine-cosine-rules" },
      { label: "Trigonometric Functions", value: "trigonometric-functions" },
      { label: "Trigonometric Identities", value: "trigonometric-identities" },
    ],
  },
  {
    label: "Statistics",
    value: "statistics",
    children: [
      { label: "Mean, Median, Mode", value: "mean-median-mode" },
      { label: "Data Distribution", value: "data-distribution" },
      { label: "Probability", value: "probability" },
      { label: "Standard Deviation", value: "standard-deviation" },
    ],
  },
];

export default function QuizGenerator() {
  const [view, setView] = useState<"generate" | "quiz">("generate");
  const [selectedTopics, setSelectedTopics] = useState<
    { topic: string; subtopic: string | null }[]
  >([]);
  const [numQuestions, setNumQuestions] = useState(5);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentDifficulty, setCurrentDifficulty] = useState(5);
  const [performance, setPerformance] = useState("neutral");
  const [quizHistory, setQuizHistory] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showBetterLuck, setShowBetterLuck] = useState(false);

  const handleGenerate = async () => {
    if (selectedTopics.length > 0) {
      setCurrentQuestionIndex(0);
      setQuizHistory([]);
      setUserAnswers([]);
      setView("quiz");
      await fetchQuestion();
    }
  };

  const fetchQuestion = async () => {
    setLoading(true);
    const topic = selectedTopics[0].subtopic || selectedTopics[0].topic;
    const response = await fetch("/api/quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        topic,
        difficulty: currentDifficulty,
        performance,
        quizHistory,
        userAnswers,
      }),
    });
    const data = await response.json();
    setQuestions([...questions, data]);
    setCurrentDifficulty(data.difficulty);
    setLoading(false);
  };

  const handleNext = () => {
    if (currentQuestionIndex < numQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      fetchQuestion();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async (answer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const answerIndex = currentQuestion.options.indexOf(answer);
    const isCorrect = answerIndex === currentQuestion.correctAnswer;

    setPerformance(isCorrect ? "correct" : "incorrect");
    setQuizHistory([...quizHistory, currentQuestion]);
    setUserAnswers([...userAnswers, answerIndex]);
    setShowCorrectAnswer(true);

    if (currentQuestionIndex === numQuestions - 1) {
      // Calculate final score
      const finalScore =
        [...userAnswers, answerIndex].filter(
          (answer, index) => questions[index].correctAnswer === answer,
        ).length / numQuestions;

      setScore(finalScore);

      // Trigger appropriate effect
      if (finalScore > 0.5) {
        setShowConfetti(true);
      } else {
        setShowBetterLuck(true);
      }
    }

    setTimeout(() => {
      setShowCorrectAnswer(false);
      if (currentQuestionIndex < numQuestions - 1) {
        handleNext();
      } else {
        // Quiz finished
        setView("generate");
        setShowConfetti(false);
        setShowBetterLuck(false);
      }
    }, 3000); // Show correct answer for 3 seconds
  };

  return (
    <Layout>
      {view === "generate" ? (
        <div className="mx-auto max-w-2xl p-6 space-y-8">
          <Card className="p-6 bg-white/95 backdrop-blur">
            <CardContent className="space-y-8">
              <h1 className="text-2xl font-semibold text-[#2E7D32]">
                Generate a math quiz by selecting topics and specifying the
                number of questions
              </h1>

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-xl font-medium text-[#2E7D32]">
                    Math Topics
                  </label>
                  <MultiSelect
                    options={mathTopics}
                    selected={selectedTopics}
                    onChange={setSelectedTopics}
                    placeholder="Select topics and subtopics"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xl font-medium text-[#2E7D32]">
                    Number of questions
                  </label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[numQuestions]}
                      onValueChange={(value) => setNumQuestions(value[0])}
                      max={20}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <div className="w-12 h-12 border rounded-lg flex items-center justify-center bg-white">
                      {numQuestions}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleGenerate}
                  disabled={selectedTopics.length === 0}
                  className="w-full h-14 text-lg bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate quiz
                  <Sparkles className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <QuizLayout
          question={questions[currentQuestionIndex]?.question || ""}
          options={questions[currentQuestionIndex]?.options || []}
          onNext={handleNext}
          onPrevious={handlePrevious}
          onSubmit={handleSubmit}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={numQuestions}
          explanation={questions[currentQuestionIndex]?.explanation || ""}
          loading={loading}
          showCorrectAnswer={showCorrectAnswer}
          correctAnswer={questions[currentQuestionIndex]?.correctAnswer || 0}
          score={currentQuestionIndex === numQuestions - 1 ? score : null}
        />
      )}
      {showConfetti && <ConfettiEffect isActive={showConfetti} />}
      <BetterLuckEffect isActive={showBetterLuck} />
    </Layout>
  );
}
