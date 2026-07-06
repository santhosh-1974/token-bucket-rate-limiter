# Token Bucket Rate Limiter

A production-ready Token Bucket Rate Limiter built with **Express**, **TypeScript**, **Redis**, **Lua Scripting**, **Docker**, and **GitHub Actions**.

The project demonstrates how to implement a high-performance distributed rate limiter using Redis and Lua while ensuring atomic operations, preventing race conditions, and providing reliable request throttling for REST APIs.

---

## Features

- Token Bucket rate limiting algorithm
- Redis-backed distributed storage
- Atomic bucket updates using Lua scripting
- Express middleware integration
- Configurable rate limit capacity and refill rate
- Standard Rate Limit response headers
- Retry-After header support
- Dockerized development environment
- Multi-stage Docker build
- Non-root production container
- Integration tests using Vitest and Supertest
- GitHub Actions Continuous Integration

---

## Tech Stack

- TypeScript
- Node.js
- Express
- Redis
- Lua
- Docker
- Docker Compose
- Vitest
- Supertest
- GitHub Actions

---

## Architecture

```
                HTTP Request
                      │
                      ▼
              Express Server
                      │
                      ▼
         Rate Limiter Middleware
                      │
                      ▼
          Token Bucket Service
                      │
                      ▼
                 Redis + Lua
                      │
                      ▼
          Atomic Bucket Update
                      │
          ┌───────────┴───────────┐
          │                       │
     Allow Request          Reject Request
```

---

## Project Structure

```
token-bucket-rate-limiter
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── src/
│   ├── config/
│   │   ├── env.ts
│   │   └── redis.ts
│   │
│   ├── lua/
│   │   └── tokenBucket.lua
│   │
│   ├── middleware/
│   │   └── rateLimiter.ts
│   │
│   ├── services/
│   │   └── tokenBucket.service.ts
│   │
│   ├── tests/
│   │   └── rateLimiter.test.ts
│   │
│   ├── app.ts
│   └── server.ts
│
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

---

## How the Token Bucket Algorithm Works

Each client is assigned a bucket containing a fixed number of tokens.

- Every request consumes one token.
- Tokens are automatically refilled at a fixed rate.
- Requests are allowed while tokens are available.
- Once the bucket becomes empty, additional requests receive **HTTP 429 Too Many Requests**.
- The client can retry after tokens have been replenished.

Redis stores the bucket state, while a Lua script performs all updates atomically to eliminate race conditions during concurrent requests.

---

## Environment Variables

Copy `.env.example` to `.env`.

```env
PORT=5000

REDIS_URL=redis://redis:6379

RATE_LIMIT_CAPACITY=10
RATE_LIMIT_REFILL_RATE=1
RATE_LIMIT_TTL=60
```

---

## Running the Project

### Clone Repository

```bash
git clone https://github.com/<your-username>/token-bucket-rate-limiter.git

cd token-bucket-rate-limiter
```

---

### Start with Docker

```bash
docker compose up --build
```

Server starts on

```
http://localhost:5000
```

---

## Running Tests

Run the integration test container.

```bash
docker compose up --build test
```

---

## API

### Request

```
GET /
```

---

### Successful Response

Status

```
200 OK
```

Headers

```
X-RateLimit-Limit: 10

X-RateLimit-Remaining: 9
```

Response

```json
{
    "success": true,
    "message": "Request allowed"
}
```

---

### Rate Limited Response

Status

```
429 Too Many Requests
```

Headers

```
Retry-After: 1

X-RateLimit-Limit: 10

X-RateLimit-Remaining: 0
```

Response

```json
{
    "success": false,
    "message": "Too Many Requests"
}
```

---

## Testing

The project includes integration tests covering:

- First request allowed
- Bucket capacity exhaustion
- Rate limit headers
- Retry-After header
- Token refill
- Separate buckets for different clients
- Concurrent request handling

---

## Docker

The project uses a multi-stage Docker build.

### Build Stages

- **deps** – installs dependencies
- **builder** – compiles TypeScript
- **test** – runs integration tests
- **runner** – production image with only runtime dependencies

The production container runs as a **non-root user** for improved security.

---

## Continuous Integration

GitHub Actions automatically:

- Builds the Docker images
- Starts Redis
- Executes integration tests
- Reports build status for every push and pull request

---

## Future Improvements

- Sliding Window algorithm
- Leaky Bucket algorithm
- Per-user rate limiting
- Per-route configuration
- Distributed metrics
- Prometheus integration
- Grafana dashboard
- API key based rate limiting

---

## License

This project is licensed under the MIT License.