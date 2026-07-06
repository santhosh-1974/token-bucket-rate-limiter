# 🚦 Token Bucket Rate Limiter

A production-inspired **Token Bucket Rate Limiter** built with **Node.js, Express, TypeScript, Redis, and Lua**. The project demonstrates atomic distributed rate limiting using Redis Lua scripts, containerized development with Docker, automated testing with GitHub Actions, and performance testing using k6.

---

## ✨ Features

- 🚀 Token Bucket rate limiting algorithm
- ⚡ Atomic token updates using Redis Lua scripting
- 🔒 Security headers with Helmet
- 🌐 CORS support
- 📝 Structured HTTP request logging with Pino
- 🐳 Docker & Docker Compose support
- ✅ Integration testing with Vitest & Supertest
- 🔄 Continuous Integration with GitHub Actions
- 📈 Load testing using k6
- 🏗️ Clean Express architecture (Routes → Middleware → Controllers → Services)

---

## 🛠️ Tech Stack

| Category | Technologies |
|----------|--------------|
| Language | TypeScript |
| Runtime | Node.js |
| Framework | Express |
| Database | Redis |
| Scripting | Lua |
| Containerization | Docker, Docker Compose |
| Testing | Vitest, Supertest |
| Load Testing | k6 |
| CI/CD | GitHub Actions |
| Logging | Pino HTTP |
| Security | Helmet, CORS |

---

## 📂 Project Structure

```text
src
│
├── app.ts
├── server.ts
│
├── config
│   ├── env.ts
│   └── redis.ts
│
├── controllers
│   ├── demo.controller.ts
│   └── health.controller.ts
│
├── middleware
│   └── rateLimiter.ts
│
├── routes
│   ├── demo.routes.ts
│   ├── health.routes.ts
│   └── index.ts
│
├── services
│   └── tokenBucket.service.ts
│
├── lua
│   └── tokenBucket.lua
│
└── tests
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/health` | Health check endpoint |
| GET | `/demo/public` | Public endpoint |
| GET | `/demo/protected` | Protected by Token Bucket rate limiter |
| GET | `/demo/slow` | Simulates a slow endpoint |
| GET | `/demo/burst` | Demonstrates configurable rate limiting |

---

## ⚙️ Environment Variables

Create a `.env` file from the example.

```bash
cp .env.example .env
```

Windows PowerShell

```powershell
Copy-Item .env.example .env
```

Example:

```env
PORT=5000

REDIS_URL=redis://localhost:6379

RATE_LIMIT_CAPACITY=10
RATE_LIMIT_REFILL_RATE=1
RATE_LIMIT_TTL=60
```

---

## 🐳 Running with Docker

Build and start the application.

```bash
docker compose up --build
```

---

## 🧪 Running Tests

Run all integration tests.

```bash
npm test
```

or using Docker

```bash
docker compose up --build test
```

---

## 📈 Load Testing

Run the k6 load test.

```bash
k6 run load-test/rateLimiter.js
```

Example metrics collected:

- Average Response Time
- P95 Latency
- Throughput (Requests/sec)
- Allowed Requests
- Blocked Requests

---

## 🔄 Continuous Integration

GitHub Actions automatically:

- Builds Docker images
- Starts Redis
- Runs integration tests
- Reports pass/fail status on every push and pull request

---

## 🧠 How the Token Bucket Works

1. Each client is assigned a token bucket in Redis.
2. Every incoming request consumes one token.
3. Tokens are replenished over time at a configurable refill rate.
4. If no tokens remain, the request is rejected with **HTTP 429 Too Many Requests**.
5. Redis Lua scripting ensures all token operations are atomic, preventing race conditions under concurrent requests.

---

## 📊 Performance

The project was load-tested using **k6**.

Sample benchmark (local machine):

- ~400 Requests/sec
- Average latency: ~5 ms
- P95 latency: ~14 ms
- Atomic Redis updates under concurrent load

---

## 🚀 Future Improvements

- Configurable per-route rate limiting
- Redis Cluster support
- Sliding Window & Leaky Bucket algorithms
- Prometheus metrics
- OpenAPI / Swagger documentation

---

## 📄 License

This project is available under the MIT License.