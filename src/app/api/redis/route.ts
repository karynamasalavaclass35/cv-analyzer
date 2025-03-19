import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

import { toast } from "@/components/ui/sonner";

const redis = new Redis({
  url: process.env.DB_KV_REST_API_URL,
  token: process.env.DB_KV_REST_API_TOKEN,
});

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const key = new URL(request.url).searchParams.get("key") ?? "";

    if (!key) {
      throw new Error("No key provided");
    }

    const result = await redis.get(key);

    if (!result) {
      return NextResponse.json([]);
    }

    return NextResponse.json(result);
  } catch (error) {
    toast.error(`Error occurred while fetching from Redis: ${error}`);
    return NextResponse.json(
      { message: `Error occurred while fetching from Redis: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { key, value } = await request.json();
    await redis.set(key, value);

    return NextResponse.json({ message: "Data saved successfully" });
  } catch (error) {
    toast.error(`Error occurred during saving to Redis: ${error}`);
    return NextResponse.json(
      { message: `Error occurred during saving to Redis: ${error}` },
      { status: 500 }
    );
  }
}
