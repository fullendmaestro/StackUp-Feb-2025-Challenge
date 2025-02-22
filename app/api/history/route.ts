import { auth } from "@/app/(auth)/auth";
import { getQuizzesByUserId } from "@/lib/db/queries";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();

  // Authourize the incoming request is a valid user
  if (!session || !session.user) {
    return NextResponse.json("Unauthorized!", { status: 401 });
  }

  // biome-ignore lint: Forbidden non-null assertion.
  const chats = await getQuizzesByUserId(session.user.id!);
  return NextResponse.json(chats, { status: 200 });
}
