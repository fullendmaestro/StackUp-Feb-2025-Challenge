import { type NextRequest, NextResponse } from "next/server";
import { getQuizById, updateAnswer } from "@/lib/db/queries";
import { auth } from "@/app/(auth)/auth";

export async function POST(req: NextRequest) {
  try {
    const { questionId, quizId, answer } = await req.json();
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quiz = await getQuizById(quizId);
    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (quiz.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Only the quiz creator can submit answers" },
        { status: 403 },
      );
    }

    const answeredQuestion = await updateAnswer({
      id: questionId,
      submitedAnswer: answer,
    });
    return NextResponse.json(answeredQuestion, { status: 200 });
  } catch (error) {
    console.error("Error updating question answer:", error);
    return NextResponse.json(
      { error: "Failed to answer question" },
      { status: 500 },
    );
  }
}
