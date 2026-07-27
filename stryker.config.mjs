// @ts-check

/** @type {import("@stryker-mutator/api/core").PartialStrykerOptions} */
const config = {
  mutate: [
    "src/features/orders/utils/calculate-order-stats.ts",
    "src/features/orders/utils/filter-orders.ts",
    "src/features/orders/utils/order-status.ts",
  ],

  testRunner: "jest",
  coverageAnalysis: "perTest",

  jest: {
    projectType: "custom",
    configFile: "jest.config.ts",
    enableFindRelatedTests: true,
  },

  checkers: ["typescript"],
  tsconfigFile: "tsconfig.json",

  reporters: ["clear-text", "progress", "html"],

  htmlReporter: {
    fileName: "coverage/mutation-report.html",
  },

  thresholds: {
    high: 90,
    low: 80,
    break: 90,
  },

  concurrency: 2,
  cleanTempDir: "always",

  ignorePatterns: [".next", "coverage"],
};

export default config;
