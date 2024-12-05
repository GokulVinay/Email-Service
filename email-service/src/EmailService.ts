import { MockProvider1, MockProvider2 } from "./MockProviders";
import { RateLimiter } from "./RateLimiter";
import { CircuitBreaker } from "./CircuitBreaker";
import { Logger } from "./Logger";

interface EmailPayload {
  id: string; // Unique identifier for idempotency
  to: string;
  subject: string;
  body: string;
}

export class EmailService {
  private providers = [new MockProvider1(), new MockProvider2()];
  private rateLimiter = new RateLimiter(10); // Limit: 10 requests/minute
  private circuitBreaker = new CircuitBreaker(3, 60000); // Max failures: 3, timeout: 60s
  private status: Record<string, string> = {}; // Tracks email statuses
  private logger = new Logger();

  async sendEmail(email: EmailPayload): Promise<string> {
    if (!this.rateLimiter.allow()) {
      throw new Error("Rate limit exceeded");
    }

    if (this.status[email.id]) {
      this.logger.log(\`Duplicate request for email ID: \${email.id}\`);
      return this.status[email.id];
    }

    let result = "failed";
    for (const provider of this.providers) {
      if (this.circuitBreaker.isOpen()) {
        this.logger.log("Circuit breaker is open, skipping provider");
        continue;
      }

      try {
        result = await this.retryWithBackoff(() =>
          provider.send(email)
        );
        this.status[email.id] = "success";
        this.logger.log(\`Email sent successfully via \${provider.name}\`);
        break;
      } catch (error) {
        this.circuitBreaker.recordFailure();
        this.logger.error(\`Provider \${provider.name} failed: \${error.message}\`);
        result = "failed";
      }
    }

    if (result === "failed") {
      this.status[email.id] = "failed";
      throw new Error("All providers failed to send email");
    }

    return result;
  }

  private async retryWithBackoff(
    fn: () => Promise<any>,
    retries = 3
  ): Promise<any> {
    let attempt = 0;
    while (attempt < retries) {
      try {
        return await fn();
      } catch (error) {
        attempt++;
        const backoff = 2 ** attempt * 100; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, backoff));
      }
    }
    throw new Error("Max retry attempts reached");
  }
}
