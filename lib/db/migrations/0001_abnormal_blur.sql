ALTER TABLE "Question" DROP CONSTRAINT "Question_questionId_Quiz_id_fk";
--> statement-breakpoint
ALTER TABLE "Question" ADD COLUMN "quizId" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "Quiz" ADD COLUMN "topics" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Quiz" ADD COLUMN "numQuestions" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_Quiz_id_fk" FOREIGN KEY ("quizId") REFERENCES "public"."Quiz"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Question" DROP COLUMN "questionId";