import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Question } from "./db/schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function calculateScore(questions: Question[]): any {
  let score = 0;
  questions.map((question) => {
    if (Number(question.submitedAnswer) == question.content.correctAnswer) {
      score++;
    }
  });

  return score;
}

export function getRandomOption(): number {
  return Math.floor(Math.random() * 4);
}

export function getRandomTopic(lenght: number): number {
  return Math.floor(Math.random() * (lenght + 1));
}
