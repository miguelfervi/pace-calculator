export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts", "**/?(*.)+(spec|test).ts"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "vue"],
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "./tsconfig.jest.json",
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
  },
  collectCoverageFrom: ["src/**/*.{ts,vue}", "!src/**/*.d.ts", "!src/main.ts"],
  setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.ts"],
  testEnvironmentOptions: {
    customExportConditions: ["node", "node-addons"],
  },
};
