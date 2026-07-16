// Fixed-window rate limiter, in-memory. Good enough for this app's shape:
// one long-running Node process per business (self-hosted on its own
// container), not a serverless/edge deployment with many disconnected
// instances — so there's no need for an external store like Redis.
interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

// Opportunistic cleanup so `buckets` doesn't grow forever — cheap at this
// traffic scale, no need for a timer/cron.
let requestsSinceSweep = 0;
function sweepExpired(now: number) {
  requestsSinceSweep++;
  if (requestsSinceSweep < 200) return;
  requestsSinceSweep = 0;
  for (const [key, bucket] of buckets) {
    if (now > bucket.resetAt) buckets.delete(key);
  }
}

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  sweepExpired(now);

  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  bucket.count++;
  return bucket.count > limit;
}
