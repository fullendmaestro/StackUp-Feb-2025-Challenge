import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";

export const runtime = "edge";

const TEMPLATE = `Generate a math question based on the given topic and difficulty level.

Topic: {topic}
Current Difficulty: {difficulty}
Previous Performance: {performance}
Quiz History: {quizHistory}
User Answers: {userAnswers}

Based on the user's previous performance, adjust the difficulty level accordingly.
Generate a question, multiple choice options, and the correct answer.`;

/**
 * This handler initializes and calls an Gemini Functions powered
 * structured output chain for generating math quiz questions.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, difficulty, performance, quizHistory, userAnswers } = body;

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);
    /**
     * Function calling is currently only supported with ChatGemini models
     */
    const model = new ChatGoogleGenerativeAI({
      modelName: "gemini-1.5-flash-002",
    });

    console.log(topic, difficulty, performance, quizHistory, userAnswers);
    /**
     * We use Zod (https://zod.dev) to define our schema for convenience,
     * but you can pass JSON schema if desired.
     */
    const schema = z
      .object({
        question: z.string().describe("The generated math question"),
        options: z
          .array(z.string())
          .describe("An array of multiple choice options"),
        correctAnswer: z
          .number()
          .describe("The index of the correct answer in the options array"),
        difficulty: z
          .number()
          .min(1)
          .max(10)
          .describe("The difficulty level of the generated question"),
        explanation: z
          .string()
          .describe("An explanation of the correct answer"),
      })
      .describe(
        "Should always be used to properly format the math question output",
      );

    /**
     * Bind schema to the Gemini model.
     * Future invocations of the returned model will always match the schema.
     *
     * Under the hood, uses tool calling by default.
     */
    const functionCallingModel = model.withStructuredOutput(schema, {
      name: "math_question_generator",
    });

    /**
     * Returns a chain with the function calling model.
     */
    const chain = prompt.pipe(functionCallingModel);

    const result = await chain.invoke({
      topic,
      difficulty,
      performance,
      quizHistory: JSON.stringify(quizHistory),
      userAnswers: JSON.stringify(userAnswers),
    });

    return NextResponse.json(result, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
