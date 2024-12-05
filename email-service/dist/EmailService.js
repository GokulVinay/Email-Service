"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const MockProviders_1 = require("./MockProviders");
const RateLimiter_1 = require("./RateLimiter");
const CircuitBreaker_1 = require("./CircuitBreaker");
const Logger_1 = require("./Logger");
class EmailService {
    constructor() {
        this.providers = [new MockProviders_1.MockProvider1(), new MockProviders_1.MockProvider2()];
        this.rateLimiter = new RateLimiter_1.RateLimiter(10); // Limit: 10 requests/minute
        this.circuitBreaker = new CircuitBreaker_1.CircuitBreaker(3, 60000); // Max failures: 3, timeout: 60s
        this.status = {}; // Tracks email statuses
        this.logger = new Logger_1.Logger();
    }
    sendEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.rateLimiter.allow()) {
                throw new Error("Rate limit exceeded");
            }
            if (this.status[email.id]) {
                this.logger.log(`Duplicate request for email ID: \${email.id}\`);
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
                );
            }
        });
    }
}
exports.EmailService = EmailService;
