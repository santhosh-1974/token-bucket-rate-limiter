# -----------Dependencies--------------
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci 


# ---------------build------------
FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . . 
RUN npm run build
RUN npm prune --omit=dev 

# -------------production-----------
FROM node:22-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

RUN addgroup -S appgroup && \
    adduser -S appuser -G appgroup

COPY --chown=appuser:appuser --from=builder /app/dist ./dist
COPY --chown=appuser:appuser --from=builder /app/node_modules ./node_modules
COPY --chown=appuser:appuser --from=builder /app/package.json ./

USER appuser
EXPOSE 5000
CMD ["node", "dist/server.js"]