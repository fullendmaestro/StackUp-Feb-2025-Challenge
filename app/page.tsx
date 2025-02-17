import { generateUUID } from "@/lib/utils";

import { QuizGenerator } from "@/components/quiz-generator";

export default async function Page() {
  const id = generateUUID();

  return (
    <>
      <QuizGenerator
        id={id}
        selectedVisibilityType="private"
        isReadonly={false}
      />
    </>
  );
}
