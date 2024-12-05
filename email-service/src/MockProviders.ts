export class MockProvider1 {
  name = "MockProvider1";
  async send(email: { id: string; to: string; subject: string; body: string }): Promise<string> {
    if (Math.random() < 0.5) {
      throw new Error("MockProvider1 failed to send email");
    }
    return "success";
  }
}

export class MockProvider2 {
  name = "MockProvider2";
  async send(email: { id: string; to: string; subject: string; body: string }): Promise<string> {
    if (Math.random() < 0.5) {
      throw new Error("MockProvider2 failed to send email");
    }
    return "success";
  }
}
