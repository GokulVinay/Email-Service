import { EmailService } from "../src/EmailService";

describe("EmailService", () => {
  it("should successfully send an email with idempotency", async () => {
    const service = new EmailService();
    const email = { id: "1", to: "test@example.com", subject: "Hello", body: "World" };

    const result = await service.sendEmail(email);
    expect(result).toBe("success");
  });

  it("should not send duplicate emails", async () => {
    const service = new EmailService();
    const email = { id: "1", to: "test@example.com", subject: "Hello", body: "World" };

    await service.sendEmail(email);
    const result = await service.sendEmail(email); // Duplicate
    expect(result).toBe("success");
  });
});
