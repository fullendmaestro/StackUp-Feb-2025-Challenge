import { type NextRequest, NextResponse } from "next/server";
import { saveQuestion, getQuizById } from "@/lib/db/queries";
import { generateQuestion } from "@/lib/quiz";
import { auth } from "@/app/(auth)/auth";
import { generateUUID } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const id = generateUUID();
    const { quizId } = await req.json();
    console.log("generating question for", quizId);
    const session = await auth();
    if (!session?.user?.id) {
      console.log("checking auth");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const quiz = await getQuizById(quizId);
    console.log("fetched quiz", quiz);
    if (!quiz) {
      console.log("checking quiz from db");
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (quiz.userId !== session.user.id) {
      console.log("checking ownership");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const question = await generateQuestion(quizId);
    const savedQuestion = await saveQuestion({
      id: generateUUID(),
      quizId,
      content: question,
    });
    console.log("savedQuestion", savedQuestion);
    return NextResponse.json(savedQuestion, { status: 200 });
  } catch (error) {
    console.error("Error generating question:", error);
    return NextResponse.json(
      { error: "Failed to generate question" },
      { status: 500 },
    );
  }
}
