"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CircuitBreaker = void 0;
class CircuitBreaker {
    constructor(maxFailures, timeout) {
        this.maxFailures = maxFailures;
        this.timeout = timeout;
        this.failureCount = 0;
        this.lastFailureTime = 0;
    }
    recordFailure() {
        this.failureCount++;
        this.lastFailureTime = Date.now();
    }
    isOpen() {
        if (this.failureCount >= this.maxFailures && Date.now() - this.lastFailureTime < this.timeout) {
            return true;
        }
        if (Date.now() - this.lastFailureTime >= this.timeout) {
            this.failureCount = 0; // Reset on timeout
        }
        return false;
    }
}
exports.CircuitBreaker = CircuitBreaker;
