import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { toast } from "@/components/ui/sonner";

const redis = new Redis({
  url: process.env.DB_KV_REST_API_URL,
  token: process.env.DB_KV_REST_API_TOKEN,
});

export async function GET(): Promise<NextResponse> {
  try {
    const prompts = await redis.lrange("prompts", 0, -1);
    return NextResponse.json(prompts);
  } catch (error) {
    toast.error(`Error occurred while fetching prompts from Redis`);
    return NextResponse.json(
      { message: `Error occurred while fetching from Redis: ${error}` },
      { status: 500 }
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { name, description } = await request.json();

    const newPrompt = {
      id: uuidv4(),
      name,
      description,
    };

    await redis.lpush("prompts", JSON.stringify(newPrompt));

    const prompts = await redis.lrange("prompts", 0, -1);

    return NextResponse.json({ prompts });
  } catch (error) {
    toast.error("Error occurred during saving prompts to Redis");
    return NextResponse.json(
      { message: `Error occurred during saving prompts to Redis: ${error}` },
      { status: 500 }
    );
  }
}
