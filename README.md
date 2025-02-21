# Quizy - AI-Powered Math Practice Application

Quizy is an intelligent math practice application designed to help students improve their mathematical skills through adaptive practice with AI-generated questions. When student answers a questions correctly or incorrectly, the system generates a new question adjusting its difficulty based students performance on previous questions for that topic.

## Features

- **Adaptive Learning**: Questions are dynamically adjusted based on student performance
- **Topic-Based Practice**: Students can select specific math topics to practice
- **Progress Tracking**: Track scores and performance for a particular quiz

## Tech Stack

- **Fullstack**: Next.js 15
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: NextAuth.js with email and password provider
- **AI Integration**: Google's Gemini AI for question generation
- **Styling**: Tailwind CSS with shadcn/ui components

## The Problem

The issue deals with providing students with more practice and ensuring that their weaknesses are strengthened. When a student gets a question wrong, it would be good for them to try the question again. However, practicing with the same set of numbers may lead to a student memorizing how to solve the question, instead of understanding how to solve that particular question type. As such, it would be better to generate a new question that is similar in method to solve, but with a different set of numbers.

## Question Generation process

The process of generating a new question retrieves the quiz details, selects a random topic, and invokes the AI model with the structured prompt and schema to generate a structured output.

### Prompt Template and dynamic prompt parameters

The `TEMPLATE` prompt template guides the AI in generating a new math question. The template includes placeholders for various dynamic inputs such as topic index, topics, question history, number of questions, and the correct option index.

```typescript
const TEMPLATE = `Generate a math question based on the given topic index from these topics.

Given Topic Index: {randomTopicIndex}

Topics: {topics}

Question history: {history}

Number of questions to be generated: {numberOfQuestions}

Based on the user's previous performance on a topic in the question history, adjust the difficulty level for the new question on that topic.
If the user is getting questions right, make the new question more difficult. If the user got a question wrong previously, generate a new question that is similar in method to solve but with a different set of numbers.

Generate a question, four multiple choice options, and the correct answer.
Place the correct answer at the index position {correctOptionIndex} in the options array.`;
```

These dynamic values that are replaced with actual data during the question generation process. These values and their reason and intentions are:

- **{topics}**: This value is a list of all available math topics. It provides context to the AI about the range of topics from which the question can be generated.

- **{randomTopicIndex}**: The AI tends to hallucinate on a particular topic from the available topics by generating questions for a single topic continously. This value represents the index of a randomly generated index for a topic from the list of available topics. This ensures that the generated question is relevant to the ongoing quiz.

- **{history}**: This value contains the user's question history, including previous questions and their submitted answer. It helps the AI adjust the difficulty of the new question based on the user's past performance.

- **{numberOfQuestions}**: This value specifies the number of questions to be generated. It allows the AI to know how many questions are needed in the current quiz.

- **{correctOptionIndex}**: The AI tends to hallucinate on a particular option index. This value indicates a randomly generated index position where the correct answer should be placed in the multiple-choice options array. It ensures that the correct answer is consistently positioned and **unpredictable**.

These dynamic values enable the AI to generate personalized and adaptive math questions tailored to the user's learning needs.

### Summary

The AI integration in this project uses a structured prompt template and schema to generate adaptive math questions. The AI model adjusts the difficulty based on the user's performance, ensuring a personalized learning experience.
