import redis from "@/database/redis";
import { Ratelimit } from "@upstash/ratelimit";


// Create a new ratelimiter, that allows 5 requests per 1 min.
const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.fixedWindow(5, "1m"),
    analytics: true,
    prefix: "@upstash/ratelimit",
});

export default ratelimit;