import app from "./app";
import { env } from "./config/env";
import { redis } from "./config/redis";
import { loadTokenBucketScript } from "./services/tokenBucket.service";
import { logger } from "./config/logger";

let server: ReturnType<typeof app.listen>;

async function bootstrap() {
    try {
        await redis.connect();
        await loadTokenBucketScript();
        server = app.listen(env.PORT, () => {
            logger.info(`🚀 Server running on port ${env.PORT}`);
        });
        registerShutdownHandlers();
    } catch (error) {
        logger.fatal({ err: error }, "Application failed to start");
        process.exit(1);
    }
}

function registerShutdownHandlers() {
    async function shutdown(signal: string) {
        logger.info(`\n${signal} received. Shutting down...`);

        server.close(async () => {
            try {
                await redis.quit();
                logger.info("✅ Redis disconnected");
                logger.info("✅ Server stopped");
                process.exit(0);
            } catch (error) {
                logger.fatal({ err: error }, "Shutdown failed");
                process.exit(1);
            }
        });
    }

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
}

bootstrap();