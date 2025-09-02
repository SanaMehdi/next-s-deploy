import { type NextRequest, NextResponse } from "next/server";
import { deletePost } from "@/app/actions/posts";

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return new NextResponse("Missing post ID", { status: 400 });
  }

  try {
    const formData = new FormData();
    formData.append("id", id);

    const result = await deletePost(formData);

    if (result && (result as any).error) {
      return new NextResponse((result as any).error, { status: 400 });
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return new NextResponse(e.message ?? "Failed to delete post", {
      status: 500,
    });
  }
}
