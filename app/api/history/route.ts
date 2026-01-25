import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/db/mongoose";
import { History, User } from "@/lib/db/models";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const history = await History.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    await connectToDatabase();

    const historyEntry = await History.create({
      userId: session.user.id,
      type: body.type,
      prompt: body.prompt,
      title: body.title,
      style: body.style,
      thumbnails: body.thumbnails || [],
      referenceImage: body.referenceImage,
      uploadedImages: body.uploadedImages || [],
    });

    return NextResponse.json(historyEntry);
  } catch (error) {
    console.error("Error creating history:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
