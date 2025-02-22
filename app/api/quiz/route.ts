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

    // Stave quiz in database
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
    // Aunthenticate the incoming request
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quizId, visibility } = await req.json();

    // Update the quiz visibility
    const quiz = await updateQuizVisiblityById({ quizId, visibility });
    console.log("quiz", quiz);

    // Respond with the updated quiz
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
  // Extract the quiz id from query parAMS
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  // Check quiz availability
  if (!id) {
    return new Response("Not Found", { status: 404 });
  }

  const session = await auth();

  // Check session
  if (!session || !session.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const chat = await getQuizById(id);

    // Authorize the user quiz to be deleted
    if (chat.userId !== session.user.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Delete the quiz from db
    await deleteQuizById({ id });

    return new Response("Chat deleted", { status: 200 });
  } catch (error) {
    return new Response("An error occurred while processing your request", {
      status: 500,
    });
  }
}
