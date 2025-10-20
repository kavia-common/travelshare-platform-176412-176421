import { jest } from "@jest/globals";

// Mock DB connect to avoid real DB usage
jest.mock("@/lib/db/mongodb", () => ({
  __esModule: true,
  connectToDatabase: jest.fn().mockResolvedValue({}),
}));

// Create a minimal chainable mock for mongoose model queries used in route
const chain = () => ({
  sort: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  lean: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([]),
});

const countExec = jest.fn().mockResolvedValue(0);

// Mock PostModel methods used by the route
jest.mock("@/lib/db/models/Post", () => {
  const find = jest.fn(() => chain());
  const countDocuments = jest.fn(() => ({ exec: countExec }));
  type CreateInput = {
    title: string;
    content?: string;
    tags?: string[];
    locations?: string[];
    images?: Array<{ url: string; publicId: string; width?: number; height?: number }>;
    tips?: Array<{ text: string; author?: string }>;
    author?: string;
    likedCount?: number;
    favorites?: string[];
    status?: "draft" | "published";
  };
  const create = jest.fn(async (data: CreateInput) => ({
    toJSON: () => ({ _id: "newid", ...data }),
  }));
  return {
    __esModule: true,
    default: {
      find,
      countDocuments,
      create,
    },
  };
});

// Import after mocks
import { GET as GET_LIST, POST as CREATE } from "./route";

function makeRequest(url: string, init?: RequestInit) {
  return new Request(url, init);
}

describe("/api/posts route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("parses query params and applies defaults (GET)", async () => {
    const url = "http://localhost/api/posts?tags=beach,food&sort=popular";
    const res = await GET_LIST(makeRequest(url));
    expect(res.status).toBe(200);
    const json = await res.json();
    // Validate pagination defaults and response structure
    expect(json).toEqual(
      expect.objectContaining({
        data: expect.any(Array),
        page: 1,
        limit: 10,
        total: 0,
        hasMore: false,
      })
    );
  });

  it("returns 400 for invalid JSON body (POST)", async () => {
    // Invalid JSON text (route uses safeParseJson and should return 400)
    const req = makeRequest("http://localhost/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{invalid json",
    });
    const res = await CREATE(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toEqual(
      expect.objectContaining({
        error: "BadRequest",
      })
    );
  });

  it("creates a post when valid (POST)", async () => {
    const body = {
      title: "Hello",
      content: "World",
      tags: ["tag1"],
      locations: ["place"],
    };
    const req = makeRequest("http://localhost/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const res = await CREATE(req);
    expect(res.status).toBe(201);
    const json = await res.json();
    expect(json).toEqual(expect.objectContaining({ _id: "newid", title: "Hello" }));
  });
});
