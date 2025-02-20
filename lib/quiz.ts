import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { z } from "zod";
import { getQuestionsByQuizId, getQuizById } from "./db/queries";
import { getRandomOption, getRandomTopic } from "./utils";

const TEMPLATE = `Generate a math question based on the given topic index from these topics.

Given Topic Index: {randomTopicIndex}

Topics: {topics}

Question history: {history}

Number of questions to be generated: {numberOfQuestions}

Based on the user's previous performance on a topic in the question history, adjust the difficulty level for the new question on that topic.
If the user is getting questions right, make the new question more difficult. If the user got a question wrong previously, generate a new question that is similar in method to solve but with a different set of numbers.

Generate a question, four multiple choice options, and the correct answer.
Place the correct answer at the index position {correctOptionIndex} in the options array.`;

const schema = z.object({
  question: z.string().describe("The generated math question"),
  options: z
    .array(z.string())
    .describe("An array of unique options where one of them is correct."),
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

  const quiz = await getQuizById(quizId);

  const randomTopicIndex = getRandomTopic(
    JSON.parse(JSON.parse(quiz.topics)).length,
  );

  console.log("generaing config:", {
    topics: (await getQuizById(quizId)).topics, // Quiz topics from the quiz metadata
    randomTopicIndex: randomTopicIndex,
    history: await getQuestionsByQuizId(quizId), // Quiz history
    correctOptionIndex: getRandomOption(),
    numberOfQuestions: quiz.numQuestions,
  });

  const result = await chain.invoke({
    topics: (await getQuizById(quizId)).topics, // Quiz topics from the quiz metadata
    randomTopicIndex: randomTopicIndex,
    history: await getQuestionsByQuizId(quizId), // Quiz history
    correctOptionIndex: getRandomOption(),
    numberOfQuestions: quiz.numQuestions,
  });

  return result;
}
