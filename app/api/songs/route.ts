import { saveSong } from "@/lib/aws";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body || !body.id || !body.title || !body.lyrics) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: id, title, lyrics" },
        { status: 400 }
      );
    }

    const result = await saveSong(body);

    if (result.success) {
      return NextResponse.json(result);
    }

    return NextResponse.json(result, { status: 500 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
