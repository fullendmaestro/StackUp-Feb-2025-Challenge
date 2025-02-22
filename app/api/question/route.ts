import { type NextRequest, NextResponse } from "next/server";
import { saveQuestion, getQuizById } from "@/lib/db/queries";
import { generateQuestion } from "@/lib/quiz";
import { auth } from "@/app/(auth)/auth";
import { generateUUID } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { quizId } = await req.json();

    // Authorize incoming request
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get quiz details
    const quiz = await getQuizById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Authorization with ownership
    if (quiz.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a question with ai
    const question = await generateQuestion(quizId);

    // Save the question into the database
    const savedQuestion = await saveQuestion({
      id: generateUUID(),
      quizId,
      content: question,
    });

    return NextResponse.json(savedQuestion, { status: 200 });
  } catch (error) {
    console.error("Error generating question:", error);
    return NextResponse.json(
      { error: "Failed to generate question" },
      { status: 500 },
    );
  }
}
