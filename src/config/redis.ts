import { createClient } from "redis";
import {env} from './env';
import {logger} from "./logger"

export const redis=createClient({
    url:env.REDIS_URL
})
redis.on("connect", () => {
    logger.info("✅ Connected to Redis");
});
redis.on("error", (error) => {
    logger.error("❌ Redis Error:", error.message);
});
