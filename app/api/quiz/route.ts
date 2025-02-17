import { NextResponse } from "next/server";
import { saveQuiz, getQuizzesByUserId } from "@/lib/db/queries";
import { auth } from "@/app/(auth)/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, topics, numQuestions, visibility } = await req.json();
    // Store quiz in database
    const newQuiz = await saveQuiz({
      id,
      title,
      topics,
      numQuestions,
      visibility,
      userId: session.user.id,
    });

    // Return the quiz ID
    return NextResponse.json({ quizId: newQuiz.id });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 },
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quizzes = await getQuizzesByUserId(session.user.id);
    return NextResponse.json(quizzes);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 },
    );
  }
}
