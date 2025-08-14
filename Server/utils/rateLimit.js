let last = 0;
export function simpleRateLimit(minIntervalMs = 800) {
  return (req, res, next) => {
    const now = Date.now();
    if (now - last < minIntervalMs)
      return res.status(429).json({ error: "Too many requests" });
    last = now;
    next();
  };
}
