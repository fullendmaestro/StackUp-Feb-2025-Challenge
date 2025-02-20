import { notFound } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { getQuizById, getQuestionsByQuizId } from "@/lib/db/queries";
import { QuizLayout } from "@/components/quiz-layout";

export default async function QuizPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;
  const quiz = await getQuizById(id);

  if (!quiz) {
    notFound();
  }

  const session = await auth();

  if (quiz.visibility === "private") {
    if (!session || !session.user) {
      return notFound();
    }

    if (session.user.id !== quiz.userId) {
      return notFound();
    }
  }

  const questions = (await getQuestionsByQuizId(id)) || [];
  const isQuizCreator = session?.user?.id === quiz.userId;

  return (
    <QuizLayout
      quiz={quiz}
      initialQuestions={questions}
      isReadonly={!isQuizCreator}
      selectedVisibilityType={quiz.visibility}
      user={session?.user}
    />
  );
}
