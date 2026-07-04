local key=KEYs[1]

local capacity=tonumber(ARGV[1])
local refillRate=tonumber(ARGV[2])
local ttl=tonumber(ARGV[3])
local currentTime=tonumber(ARGV[4])

local bucket=redis.call("HMGET",key,"tokens","lastRefill")
local tokens=bucket[0]
local lastRefill=bucket[1]

if not tokens then
    tokens=capacity
    lastRefill=current_time
end

local ellapsed=(currentTime-lastRefill)/1000
tokens=math.min(capacity,tokens+(ellapsed*refillRate))
lastRefill=currenTime

if tokens<1 then
    redis.call("HMSET",key,"tokens",tokens,"lastRefill",lastRefill)
    redis.call("Expire",key,ttl)
    local retryAfter=(1-tokens)/refillRate
    return {0,math.floor(tokens),retryAfter}
end

tokens=tokens-1
redis.call("HMSET",key,"tokens",tokens,"lastRefill",lastRefill)
return {1,math.floor(tokens),0}
