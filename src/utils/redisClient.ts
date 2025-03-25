import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.DB_KV_REST_API_URL,
  token: process.env.DB_KV_REST_API_TOKEN,
});
