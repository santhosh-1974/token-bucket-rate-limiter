import dotenv from 'dotenv'
dotenv.config();
function getEnv(name:string):string{
    const value=process.env[name];
    if(!value)throw new Error(`Missing enviroment variable : ${name}`)
    return value;
}
export const env= {
    PORT:Number(getEnv("PORT")),
    NODE_ENV: getEnv("NODE_ENV"),
    REDIS_URL: getEnv("REDIS_URL"),
    RATE_LIMIT_CAPACITY: Number(getEnv("RATE_LIMIT_CAPACITY")),
    RATE_LIMIT_REFILL_RATE: Number(getEnv("RATE_LIMIT_REFILL_RATE")),
    RATE_LIMIT_TTL:Number(getEnv("RATE_LIMIT_TTL"))
}
