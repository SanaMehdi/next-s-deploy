import { NextResponse } from "next/server";
import { createPost } from "@/app/actions/posts";

export async function POST(req: Request) {
  const fd = await req.formData();
  try {
    await createPost(fd);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return new NextResponse(e.message ?? "Failed", { status: 400 });
  }
}
