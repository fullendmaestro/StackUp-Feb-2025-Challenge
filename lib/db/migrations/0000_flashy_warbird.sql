CREATE TABLE "Question" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"questionId" uuid NOT NULL,
	"content" json NOT NULL,
	"createdAt" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Quiz" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp NOT NULL,
	"title" text NOT NULL,
	"userId" uuid NOT NULL,
	"visibility" varchar DEFAULT 'private' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(64) NOT NULL,
	"password" varchar(64)
);
--> statement-breakpoint
ALTER TABLE "Question" ADD CONSTRAINT "Question_questionId_Quiz_id_fk" FOREIGN KEY ("questionId") REFERENCES "public"."Quiz"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_userId_User_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE no action ON UPDATE no action;