import type { InferSelectModel } from "drizzle-orm";
import {
  pgTable,
  varchar,
  timestamp,
  json,
  uuid,
  text,
  primaryKey,
  foreignKey,
  boolean,
} from "drizzle-orm/pg-core";
import { AiQuestion } from "../quiz";

export const user = pgTable("User", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  email: varchar("email", { length: 64 }).notNull(),
  password: varchar("password", { length: 64 }),
});

export type User = InferSelectModel<typeof user>;

export const quiz = pgTable("Quiz", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  createdAt: timestamp("createdAt").notNull(),
  title: text("title").notNull(),
  userId: uuid("userId")
    .notNull()
    .references(() => user.id),
  topics: text("topics").notNull(),
  numQuestions: text("numQuestions").notNull(),
  visibility: varchar("visibility", { enum: ["public", "private"] })
    .notNull()
    .default("private"),
});

export type Quiz = InferSelectModel<typeof quiz>;

export const question = pgTable("Question", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  quizId: uuid("quizId")
    .notNull()
    .references(() => quiz.id),
  content: json("content").notNull(),
  createdAt: timestamp("createdAt").notNull(),
  submitedAnswer: text("submitedAnswer"),
});

export type Question = Omit<InferSelectModel<typeof question>, "content"> & {
  content: AiQuestion;
};
