import { describe, it, expect } from "vitest";
import { RateLimiter } from "@/lib/rate-limiter";

describe("Rate Limiter", () => {
  it("should allow requests within limit", () => {
    const limiter = new RateLimiter(5); // 5 tokens
    const ip = "192.168.1.1";

    const res1 = limiter.consume(ip, 1);
    expect(res1.allowed).toBe(true);

    const res2 = limiter.consume(ip, 2);
    expect(res2.allowed).toBe(true);
  });

  it("should block requests when quota is exhausted", () => {
    const limiter = new RateLimiter(3);
    const ip = "192.168.1.2";

    expect(limiter.consume(ip, 2).allowed).toBe(true);
    expect(limiter.consume(ip, 1).allowed).toBe(true);
    // Exhausted
    expect(limiter.consume(ip, 1).allowed).toBe(false);
  });

  it("should isolate rate limits between different IPs", () => {
    const limiter = new RateLimiter(2);
    const ipA = "10.0.0.1";
    const ipB = "10.0.0.2";

    expect(limiter.consume(ipA, 2).allowed).toBe(true);
    expect(limiter.consume(ipA, 1).allowed).toBe(false);

    // ipB should still have full quota
    expect(limiter.consume(ipB, 2).allowed).toBe(true);
  });
});
