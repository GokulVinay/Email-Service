export class CircuitBreaker {
  private maxFailures: number;
  private timeout: number;
  private failureCount: number;
  private lastFailureTime: number;

  constructor(maxFailures: number, timeout: number) {
    this.maxFailures = maxFailures;
    this.timeout = timeout;
    this.failureCount = 0;
    this.lastFailureTime = 0;
  }

  recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();
  }

  isOpen(): boolean {
    if (this.failureCount >= this.maxFailures && Date.now() - this.lastFailureTime < this.timeout) {
      return true;
    }
    if (Date.now() - this.lastFailureTime >= this.timeout) {
      this.failureCount = 0; // Reset on timeout
    }
    return false;
  }
}
