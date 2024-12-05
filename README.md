
# Email Service

A resilient email sending service implemented in TypeScript.

## Features

- Retry with exponential backoff
- Provider fallback
- Idempotency handling
- Rate limiting
- Circuit breaker pattern
- Basic logging

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Run the tests:
   ```
   npm test
   ```

3. Start the service:
   ```
   npm start
   ```

## Testing

Unit tests are located in the `tests/` directory. Run them using:
```
npm test
```

## Assumptions

- Providers are mocked for testing purposes.
- Rate limiter is set to 10 requests per minute.
- Circuit breaker resets after 1 minute.
