import { NextResponse } from "next/server";
import {
  saveQuiz,
  getQuizzesByUserId,
  updateQuizVisiblityById,
  getQuizById,
  deleteQuizById,
} from "@/lib/db/queries";
import { auth } from "@/app/(auth)/auth";
import { generateUUID } from "@/lib/utils";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, title, topics, numQuestions, visibility } = await req.json();
    // Store quiz in database
    console.log({
      id: generateUUID(),
      title,
      topics: JSON.stringify(topics),
      numQuestions,
      visibility,
      userId: session.user.id,
    });
    const newQuiz = await saveQuiz({
      id: generateUUID(),
      title,
      topics: JSON.stringify(topics),
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

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quizId, visibility } = await req.json();

    const quiz = await updateQuizVisiblityById({ quizId, visibility });
    console.log("quiz", quiz);
    return NextResponse.json(quiz);
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getQuizById(id);

    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    await deleteQuizById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
