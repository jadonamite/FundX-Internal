import { defineConfig } from "vitest/config";
import {
  vitestSetupFilePath,
  getClarinetVitestsArgv,
} from "@stacks/clarinet-sdk/vitest";

/*
  Vitest is configured to work with Clarinet and the Simnet.
  The `vitest-environment-clarinet` initialises the clarinet-sdk and exposes
  the global `simnet` object to test files.
*/

export default defineConfig({
  test: {
    environment: "clarinet",
    pool: "forks",
    isolate: false,
    maxWorkers: 1,
    setupFiles: [vitestSetupFilePath],
    environmentOptions: {
      clarinet: {
        ...getClarinetVitestsArgv(),
      },
    },
  },
});
