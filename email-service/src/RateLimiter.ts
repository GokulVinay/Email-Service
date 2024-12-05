export class RateLimiter {
  private limit: number;
  private interval: number;
  private timestamps: number[];

  constructor(limit: number, intervalMs: number = 60000) {
    this.limit = limit;
    this.interval = intervalMs;
    this.timestamps = [];
  }

  allow(): boolean {
    const now = Date.now();
    this.timestamps = this.timestamps.filter((timestamp) => now - timestamp < this.interval);
    if (this.timestamps.length >= this.limit) {
      return false;
    }
    this.timestamps.push(now);
    return true;
  }
}
