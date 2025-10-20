const config = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json", diagnostics: false }],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^next/image$": "<rootDir>/test/__mocks__/next-image.tsx",
  },
  setupFilesAfterEnv: ["<rootDir>/test/setupTests.js"],
  testMatch: ["**/?(*.)+(test).[tj]s?(x)"],
  testPathIgnorePatterns: ["/node_modules/", "/.next/"],
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts"],
};

module.exports = config;
