import "@testing-library/jest-dom";
import { TextEncoder, TextDecoder } from "util";

// Polyfills often needed by Next.js/whatwg
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock next/navigation router hooks if accidentally imported by components
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({}),
}));

// Ensure process env defaults to avoid accidental throws
process.env.MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/test";
process.env.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "demo";
process.env.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "key";
process.env.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "secret";
