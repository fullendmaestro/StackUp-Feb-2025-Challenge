"use client";

// import { updateQuizVisibility } from "@/app/actions";
import { VisibilityType } from "@/components/visibility-selector";
import { Quiz } from "@/lib/db/schema";
import { useMemo } from "react";
import useSWR, { useSWRConfig } from "swr";

export function useQuizVisibility({
  quizId,
  initialVisibility,
}: {
  quizId: string;
  initialVisibility: VisibilityType;
}) {
  const { mutate, cache } = useSWRConfig();
  const history: Array<Quiz> = cache.get("/api/history")?.data;

  const { data: localVisibility, mutate: setLocalVisibility } = useSWR(
    `${quizId}-visibility`,
    null,
    {
      fallbackData: initialVisibility,
    },
  );

  const visibilityType = useMemo(() => {
    if (!history) return localVisibility;
    const quiz = history.find((quiz) => quiz.id === quizId);
    if (!quiz) return "private";
    return quiz.visibility;
  }, [history, quizId, localVisibility]);

  const setVisibilityType = (updatedVisibilityType: VisibilityType) => {
    setLocalVisibility(updatedVisibilityType);

    mutate<Array<Quiz>>(
      "/api/history",
      (history) => {
        return history
          ? history.map((quiz) => {
              if (quiz.id === quizId) {
                return {
                  ...quiz,
                  visibility: updatedVisibilityType,
                };
              }
              return quiz;
            })
          : [];
      },
      { revalidate: false },
    );

    // updateQuizVisibility({
    //   quizId: quizId,
    //   visibility: updatedVisibilityType,
    // });
  };

  return { visibilityType, setVisibilityType };
}
