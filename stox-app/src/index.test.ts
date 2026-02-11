import { describe, it, expect, vi, beforeEach } from "vitest";
import app from "./index.js";
import { db } from "./db/index.js";

// dbモジュールのモック
vi.mock("./db/index", () => {
  const mockInsert = vi.fn().mockImplementation(() => ({
    values: vi.fn().mockReturnThis(),
    returning: vi.fn().mockResolvedValue([
      {
        id: "mock-id-123",
        userId: "test-user",
        url: "http://test.com/recipe",
      },
    ]),
  }));

  return {
    db: {
      insert: vi.fn(() => mockInsert()),
    },
  };
});

describe("POST /recipes", () => {
  beforeEach(() => {
    // 各テストの前にモックをリセット
    vi.clearAllMocks();
  });

  it("should create a new recipe and return 201", async () => {
    const response = await app.request("/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: "test-user",
        url: "http://test.com/recipe",
      }),
    });

    expect(response.status).toBe(201);
    const body = await response.json();
    expect(body).toEqual({
      id: "mock-id-123",
      userId: "test-user",
      url: "http://test.com/recipe",
    });
    expect(db.insert).toHaveBeenCalledTimes(1);
  });

  it("should return 400 if userId is missing", async () => {
    const response = await app.request("/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url: "http://test.com/recipe" }),
    });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ error: "userId and url are required" });
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("should return 400 if url is missing", async () => {
    const response = await app.request("/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: "test-user" }),
    });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ error: "userId and url are required" });
    expect(db.insert).not.toHaveBeenCalled();
  });

  it("should return 400 if both userId and url are missing", async () => {
    const response = await app.request("/recipes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ error: "userId and url are required" });
    expect(db.insert).not.toHaveBeenCalled();
  });
});
