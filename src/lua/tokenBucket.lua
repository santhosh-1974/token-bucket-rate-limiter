local key=KEYS[1]

local capacity=tonumber(ARGV[1])
local refillRate=tonumber(ARGV[2])
local ttl=tonumber(ARGV[3])
local currentTime=tonumber(ARGV[4])

local bucket=redis.call("HMGET",key,"tokens","lastRefill")
local tokens=tonumber(bucket[1])
local lastRefill=tonumber(bucket[2])

if not tokens then
    tokens=capacity
    lastRefill=currentTime
end

local ellapsed=(currentTime-lastRefill)/1000
tokens=math.min(capacity,tokens+(ellapsed*refillRate))
lastRefill=currentTime

if tokens<1 then
    redis.call("HMSET",key,"tokens",tokens,"lastRefill",lastRefill)
    redis.call("EXPIRE",key,ttl)
    local retryAfter=math.ceil((1-tokens)/refillRate)
    return {0,math.floor(tokens),retryAfter}
end

tokens=tokens-1
redis.call("HMSET",key,"tokens",tokens,"lastRefill",lastRefill)
redis.call("EXPIRE",key,ttl)
return {1,math.floor(tokens),0}
