import app from "./app";
import { env } from "./config/env";
import { redis } from "./config/redis";

let server: ReturnType<typeof app.listen>;

async function bootstrap() {
    try {
        await redis.connect();
        server = app.listen(env.PORT, () => {
            console.log(`🚀 Server running on port ${env.PORT}`);
        });
        registerShutdownHandlers();
    } catch (error) {
        console.error({ err: error }, "Application failed to start");
        process.exit(1);
    }
}

function registerShutdownHandlers() {
    async function shutdown(signal: string) {
        console.log(`\n${signal} received. Shutting down...`);

        server.close(async () => {
            try {
                await redis.quit();
                console.log("✅ Redis disconnected");
                console.log("✅ Server stopped");
                process.exit(0);
            } catch (error) {
                console.error({ err: error }, "Shutdown failed");
                process.exit(1);
            }
        });
    }

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
}

bootstrap();