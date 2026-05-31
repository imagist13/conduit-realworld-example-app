import { generateReadCount } from "./generateReadCount";

describe("generateReadCount", () => {
  it("should return a number", () => {
    const result = generateReadCount("test-slug");
    expect(typeof result).toBe("number");
  });

  it("should return a number between 1 and 99999", () => {
    for (let i = 0; i < 100; i++) {
      const result = generateReadCount(`slug-${i}`);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(99999);
    }
  });

  it("should return the same value for the same slug (deterministic)", () => {
    const slug = "my-article-123";
    const result1 = generateReadCount(slug);
    const result2 = generateReadCount(slug);
    expect(result1).toBe(result2);
  });

  it("should return different values for different slugs", () => {
    const result1 = generateReadCount("slug-a");
    const result2 = generateReadCount("slug-b");
    expect(result1).not.toBe(result2);
  });

  it("should handle empty string", () => {
    const result = generateReadCount("");
    expect(typeof result).toBe("number");
    expect(result).toBeGreaterThanOrEqual(1);
  });

  it("should handle special characters", () => {
    const result = generateReadCount("hello-world-2024!");
    expect(typeof result).toBe("number");
    expect(result).toBeGreaterThanOrEqual(1);
  });
});
