import { genSaltSync, hashSync } from "bcrypt-ts";
import {
  user,
  type User,
  quiz,
  question,
  type Quiz,
  type Question,
} from "./schema";
import { eq, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const client = postgres(process.env.POSTGRES_URL!);
const db = drizzle(client);

export async function getUser(email: string): Promise<Array<User>> {
  try {
    return await db.select().from(user).where(eq(user.email, email));
  } catch (error) {
    console.error("Failed to get user from database");
    throw error;
  }
}

export async function createUser(email: string, password: string) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);

  try {
    return await db.insert(user).values({ email, password: hash });
  } catch (error) {
    console.error("Failed to create user in database");
    throw error;
  }
}

// Create
export async function saveQuiz({
  id,
  userId,
  title,
  topics,
  numQuestions,
  visibility,
}: {
  id: string;
  title: string;
  userId: string;
  topics: string;
  numQuestions: string;
  visibility: "public" | "private";
}) {
  const [newQuiz] = await db
    .insert(quiz)
    .values({
      id,
      createdAt: new Date(),
      title,
      userId,
      topics,
      numQuestions,
      visibility,
    })
    .returning();
  return newQuiz;
}

export async function saveQuestion({
  id,
  quizId,
  content,
}: {
  id: string;
  quizId: string;
  content: unknown;
}) {
  const [newQuestion] = await db
    .insert(question)
    .values({ id, createdAt: new Date(), quizId, content })
    .returning();
  return newQuestion;
}

// Read
export async function getQuizById(id: string) {
  const [result] = await db.select().from(quiz).where(eq(quiz.id, id));
  return result;
}

export async function getQuizzesByUserId(userId: string) {
  return await db
    .select()
    .from(quiz)
    .where(eq(quiz.userId, userId))
    .orderBy(desc(quiz.createdAt));
}

export async function getQuestionsByQuizId(quizId: string) {
  return await db
    .select()
    .from(question)
    .where(eq(question.quizId, quizId))
    .orderBy(asc(question.createdAt));
}

// Update
export async function updateQuizTitle(id: string, title: string) {
  const [updatedQuiz] = await db
    .update(quiz)
    .set({ title })
    .where(eq(quiz.id, id))
    .returning();
  return updatedQuiz;
}

// export async function updateQuestion({
//   id,
//   content,
// }: {
//   id: string;
//   content: any;
// }) {
//   const [updatedQuestion] = await db
//     .update(question)
//     .set({ content })
//     .where(eq(question.id, id))
//     .returning();
//   return updatedQuestion;
// }

export async function updateAnswer({
  id,
  submitedAnswer,
}: {
  id: string;
  submitedAnswer: any;
}) {
  const [updatedQuestion] = await db
    .update(question)
    .set({ submitedAnswer })
    .where(eq(question.id, id))
    .returning();
  return updatedQuestion;
}

// Delete
export async function deleteQuizById({ id }: { id: string }) {
  try {
    await db.delete(question).where(eq(question.quizId, id));

    return await db.delete(quiz).where(eq(quiz.id, id));
  } catch (error) {
    console.error("Failed to delete chat by id from database");
    throw error;
  }
}

export async function deleteQuiz(id: string) {
  await db.delete(quiz).where(eq(quiz.id, id));
}

export async function deleteQuestion(id: string) {
  await db.delete(question).where(eq(question.id, id));
}

export async function updateQuizVisiblityById({
  quizId,
  visibility,
}: {
  quizId: string;
  visibility: "private" | "public";
}) {
  try {
    return await db.update(quiz).set({ visibility }).where(eq(quiz.id, quizId));
  } catch (error) {
    console.error("Failed to update quiz visibility in database");
    throw error;
  }
}
