import { searchSongsByTitleAndLyrics } from "@/lib/aws";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  if (!query || query.trim().length === 0) {
    return NextResponse.json(
      { success: false, error: "Search query is required" },
      { status: 400 }
    );
  }

  const result = await searchSongsByTitleAndLyrics(query.toLowerCase());

  if (result.success) {
    return NextResponse.json(result);
  }

  return NextResponse.json(result, { status: 500 });
}
