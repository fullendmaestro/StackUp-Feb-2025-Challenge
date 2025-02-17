import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { getQuestionsByQuizId, getQuizById } from "./db/queries";

const TEMPLATE = `Generate a math question based on any of these given topic.

Topics: {topics}

Question history: {history}

Based on the user's previous performance in the qustion history, adjust the difficulty level for the new question accordingly.
Generate a question, multiple choice options, and the correct answer.`;

const schema = z.object({
  question: z.string().describe("The generated math question"),
  options: z
    .array(z.string())
    .describe(
      "An array of multiple choice options with four randomly arranged options where one of them is correct",
    ),
  correctAnswer: z
    .number()
    .describe(
      "The index position of the correct option in the options array. Ranges from 0 to 3",
    ),
  explanation: z
    .string()
    .describe("A simple brief explanation of the correct answer"),
});

export type AiQuestion = z.infer<typeof schema>;

export async function generateQuestion(quizId: string) {
  const prompt = PromptTemplate.fromTemplate(TEMPLATE);
  const model = new ChatGoogleGenerativeAI({
    modelName: "gemini-1.5-flash-002",
  });

  const functionCallingModel = model.withStructuredOutput(schema);
  const chain = prompt.pipe(functionCallingModel);

  const result = await chain.invoke({
    topics: (await getQuizById(quizId)).topics, // Quiz topics from the quiz metadata
    history: await getQuestionsByQuizId(quizId), // Quiz history
  });

  return result;
}
