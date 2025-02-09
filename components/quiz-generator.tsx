import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { MultiSelect } from "@/components/ui/multi-select";

interface QuizGeneratorProps {
  selectedTopics: { topic: string; subtopic: string | null }[];
  setSelectedTopics: (
    topics: { topic: string; subtopic: string | null }[],
  ) => void;
  numQuestions: number;
  setNumQuestions: (num: number) => void;
  numChoices: number;
  setNumChoices: (num: number) => void;
  onGenerate: () => void;
  mathTopics: any[]; // Replace 'any' with a more specific type if available
}

export function QuizGenerator({
  selectedTopics,
  setSelectedTopics,
  numQuestions,
  setNumQuestions,
  numChoices,
  setNumChoices,
  onGenerate,
  mathTopics,
}: QuizGeneratorProps) {
  return (
    <div className="mx-auto max-w-2xl p-6 space-y-8">
      <Card className="p-6 bg-white/95 backdrop-blur">
        <CardContent className="space-y-8">
          <h1 className="text-2xl font-semibold text-[#2E7D32]">
            Generate a math quiz by selecting topics and specifying the number
            of questions and choices
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

            <div className="space-y-2">
              <label className="text-xl font-medium text-[#2E7D32]">
                Choices per question
              </label>
              <div className="flex items-center gap-4">
                <Slider
                  value={[numChoices]}
                  onValueChange={(value) => setNumChoices(value[0])}
                  max={5}
                  min={2}
                  step={1}
                  className="flex-1"
                />
                <div className="w-12 h-12 border rounded-lg flex items-center justify-center bg-white">
                  {numChoices}
                </div>
              </div>
            </div>

            <Button
              onClick={onGenerate}
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
  );
}
