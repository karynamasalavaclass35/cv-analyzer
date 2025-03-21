import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { Prompt } from "@/app/components/prompt/types";

const redis = new Redis({
  url: process.env.DB_KV_REST_API_URL,
  token: process.env.DB_KV_REST_API_TOKEN,
});

export async function GET(): Promise<NextResponse> {
  try {
    const prompts = await redis.lrange("prompts", 0, -1);
    return NextResponse.json(prompts);
  } catch (error) {
    return NextResponse.json(
      { message: `Error occurred while fetching: ${error}` },
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
    return NextResponse.json(
      { message: `Error occurred during saving prompts: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request): Promise<NextResponse> {
  try {
    const { id } = await request.json();
    const prompts: Prompt[] = await redis.lrange("prompts", 0, -1);
    const promptToDelete = prompts.find((prompt) => prompt.id === id);

    if (promptToDelete === undefined) {
      return NextResponse.json(
        { message: "Prompt not found" },
        { status: 404 }
      );
    }

    await redis.lrem("prompts", 1, JSON.stringify(promptToDelete));

    const updatedPrompts = await redis.lrange("prompts", 0, -1);

    return NextResponse.json({ prompts: updatedPrompts });
  } catch (error) {
    return NextResponse.json(
      { message: `Error occurred during deleting prompts: ${error}` },
      { status: 500 }
    );
  }
}
