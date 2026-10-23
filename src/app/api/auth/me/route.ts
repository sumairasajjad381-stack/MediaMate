import { NextResponse } from "next/server";
import { getOptionalUser } from "@/lib/security/auth";

export async function GET() {
  const user = await getOptionalUser();
  if (!user) {
    return NextResponse.json({ success: true, data: { user: null } });
  }

  return NextResponse.json({
    success: true,
    data: { user },
  });
}
