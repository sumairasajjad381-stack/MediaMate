import { NextRequest, NextResponse } from "next/server";
import { inspectUrl } from "@/lib/platforms";

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request payload." },
        { status: 400 }
      );
    }
    const { url, platform } = body || {};

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "A valid URL string is required.",
        },
        { status: 400 }
      );
    }

    const result = await inspectUrl(url, platform);

    return NextResponse.json({
      success: result.isSupported,
      data: result,
    });
  } catch (err) {
    console.error("API Inspect Error:", err);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected error occurred while inspecting the media link.",
      },
      { status: 500 }
    );
  }
}
