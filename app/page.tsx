import { cookies } from "next/headers";
import { generateUUID } from "@/lib/utils";

import { QuizGenerator } from "@/components/quiz-generator";
import { auth } from "./(auth)/auth";

export default async function Page() {
  const id = generateUUID();
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);

  return (
    <>
      <QuizGenerator
        id={id}
        selectedVisibilityType="private"
        isReadonly={true}
        user={session?.user}
      />
    </>
  );
}
