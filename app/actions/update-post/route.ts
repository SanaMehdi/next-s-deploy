import { NextResponse } from "next/server";
import { updatePost } from "@/app/actions/posts";

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id")!;
  const fd = await req.formData();
  try {
    await updatePost(id, fd);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return new NextResponse(e.message ?? "Failed", { status: 400 });
  }
}
