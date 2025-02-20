"use client";

import type { User } from "next-auth";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";
import { Input } from "@/components/ui/input";
import { Layout } from "./layout";
import { VisibilityType } from "./visibility-selector";

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

export function QuizGenerator({
  id,
  selectedVisibilityType,
  isReadonly,
  user,
}: {
  id: string;
  selectedVisibilityType: VisibilityType;
  isReadonly: boolean;
  user: User | undefined;
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [selectedTopics, setSelectedTopics] = useState<
    Array<{ topic: string; subtopic: string | null }>
  >([]);
  const [numQuestions, setNumQuestions] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (selectedTopics.length === 0 || !title) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          title,
          topics: JSON.stringify(selectedTopics),
          numQuestions,
          visibility: "private",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create quiz");
      }

      const { quizId } = await response.json();
      router.push(`/quiz/${quizId}`);
    } catch (error) {
      console.error("Error creating quiz:", error);
      // Handle error (e.g., show error message)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout
      quizId={id}
      selectedVisibilityType={selectedVisibilityType}
      isReadonly={true}
      user={user}
    >
      <div className="mx-auto max-w-2xl p-6 space-y-8">
        <Card className="p-6 bg-white/95 backdrop-blur rounded-lg">
          <CardContent className="space-y-8">
            <h1 className="text-2xl font-semibold text-[#2E7D32]">
              Generate a math quiz by selecting topics and specifying the number
              of questions
            </h1>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xl font-medium text-[#2E7D32]">
                  Quiz Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter quiz title"
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-4">
                <label className="text-xl font-medium text-[#2E7D32]">
                  Math Topics
                </label>
                <MultiSelect
                  options={mathTopics}
                  selected={selectedTopics}
                  onChange={setSelectedTopics}
                  placeholder="Select topics and subtopics"
                  className="rounded-xl px-5"
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
                    className="flex-1 rounded-xl"
                  />
                  <div className="w-12 h-12 border rounded-xl flex items-center justify-center bg-white">
                    {numQuestions}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleGenerate}
                disabled={selectedTopics.length === 0 || !title || isLoading}
                className="w-full h-14 text-lg bg-[#2E7D32] hover:bg-[#1B5E20] text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Generating..." : "Generate quiz"}
                {!isLoading && <Sparkles className="ml-2 h-5 w-5" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
