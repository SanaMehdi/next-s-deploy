import { NextResponse } from "next/server";
import { deletePost } from "@/app/actions/posts";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")!;
  try {
    await deletePost(id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return new NextResponse(e.message ?? "Failed", { status: 400 });
  }
}
