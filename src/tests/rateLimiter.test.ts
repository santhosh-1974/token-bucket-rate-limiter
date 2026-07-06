import request from "supertest"
import { describe ,it,expect,beforeAll,afterAll,beforeEach} from "vitest";
import app from "../app"
import {redis} from "../config/redis"
import { loadTokenBucketScript } from "../services/tokenBucket.service";
import {env} from "../config/env"

const CAPACITY=env.RATE_LIMIT_CAPACITY

describe("Token Bucket Rate Limiter",()=>{
    beforeAll(async()=>{
        await redis.connect();
        await loadTokenBucketScript();
    })
    beforeEach(async()=>{
        await redis.flushDb();
    })
    afterAll(async()=>{
        if (redis.isOpen) {
            await redis.quit();
        }
    })
    it("should return API health", async () => {
        const response = await request(app).get("/health");
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
    });

    it("should allow the first request",async()=>{
        const response=await request(app).get('/demo/protected');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true)
    })

    it("should reject requests after capacity is exhausted",async()=>{
        for(let i=0;i<CAPACITY;i++){
            await request(app).get('/demo/protected');
        }
        const response =await request(app).get('/demo/protected');
        expect(response.status).toBe(429);
    })

    it("Should send rate limit headers",async()=>{
        const response=await request(app).get('/demo/protected');
        expect(response.headers['x-ratelimit-limit']).toBeDefined();
        expect(response.headers['x-ratelimit-remaining']).toBeDefined();
    })

    it("Should send RetryAfter header",async()=>{
        for(let i=0;i<CAPACITY;i++){
            await request(app).get('/demo/protected')
        }
        const response=await request(app).get('/demo/protected');
        expect(Number(response.headers['retryafter'])).toBeGreaterThanOrEqual(1);
    })

    it("should allow requests again after tokens are refilled",async()=>{
        for(let i=0;i<CAPACITY;i++){
            await request(app).get('/demo/protected')
        }
        await new Promise(resolve=>{
            setTimeout(resolve,Number(process.env.RATE_LIMIT_REFILL_RATE)*1000)
        })
        const response=await request(app).get("/demo/protected");
        
        expect(response.status).toBe(200)
        expect(response.headers["x-ratelimit-remaining"]).toBeDefined();
    })

    it("should create separate buckets for different IP addresses", async () => {
        const user1 = await request(app).get("/demo/protected").set("X-Forwarded-For", "10.0.0.1");
        const user2 = await request(app).get("/demo/protected").set("X-Forwarded-For", "10.0.0.2");

        expect(user1.status).toBe(200);
        expect(user2.status).toBe(200);
    });

   it("should handle concurrent requests atomically", async () => {
        const requests = Array.from({ length: 100 }, () =>
        request(app).get("/demo/protected")
        );

        const responses = await Promise.all(requests);
        const allowed = responses.filter((r) => r.status === 200).length;
        const blocked = responses.filter((r) => r.status === 429).length;

        expect(allowed).toBe(CAPACITY);
        expect(blocked).toBe(100 - CAPACITY);
    });
    
})