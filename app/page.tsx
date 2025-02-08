"use client";

import { QuizLayout } from "@/components/quiz-layout";
import { useState } from "react";

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}
// Define math topics and their subtopics
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

export default function Home() {
  const [view, setView] = useState<"generate" | "quiz">("generate");
  const [selectedTopics, setSelectedTopics] = useState<
    { topic: string; subtopic: string | null }[]
  >([]);
  const [numQuestions, setNumQuestions] = useState(5);
  const [numChoices, setNumChoices] = useState(3);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      question: "6 - 3 = ?",
      options: ["2", "3", "4", "5"],
      correctAnswer: "3",
    },
    {
      question: "8 + 4 = ?",
      options: ["10", "11", "12", "13"],
      correctAnswer: "12",
    },
    {
      question: "15 ÷ 3 = ?",
      options: ["3", "4", "5", "6"],
      correctAnswer: "5",
    },
  ]);

  const handleGenerate = () => {
    if (selectedTopics.length > 0) {
      setCurrentQuestionIndex(0);
      setView("quiz");
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = (answer: string) => {
    // Here you would typically handle the answer submission
    console.log(`Submitted answer: ${answer}`);
    if (currentQuestionIndex < questions.length - 1) {
      handleNext();
    }
  };

  const groupedTopics = selectedTopics.reduce(
    (acc, { topic, subtopic }) => {
      if (!acc[topic]) {
        acc[topic] = [];
      }
      if (subtopic) {
        acc[topic].push(subtopic);
      }
      return acc;
    },
    {} as Record<string, string[]>,
  );

  const toggleTopic = (topic: string) => {
    setOpenTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic],
    );
  };
  const [isTopicsOpen, setIsTopicsOpen] = useState(false);
  const [openTopics, setOpenTopics] = useState<string[]>([]);

  const currentQuestion = questions[currentQuestionIndex];
  return (
    <div className="min-h-screen bg-[#E8F4FC]">
      <QuizLayout
        question={questions[currentQuestionIndex].question}
        options={questions[currentQuestionIndex].options}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onSubmit={handleSubmit}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
      />
    </div>
  );
}
