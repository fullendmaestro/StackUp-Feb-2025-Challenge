import { VisibilityType } from "@/components/visibility-selector";
import { updateQuizVisiblityById } from "@/lib/db/queries";

export async function updateQuizVisibility({
  quizId,
  visibility,
}: {
  quizId: string;
  visibility: VisibilityType;
}) {
  await updateQuizVisiblityById({ quizId, visibility });
}
