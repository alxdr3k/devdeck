import { describe, expect, it } from "vitest";

import { runCli, startupMessage } from "../../src/cli-core.js";

describe("CLI startup", () => {
  it("starts without throwing and writes the scaffold message", () => {
    const chunks: string[] = [];

    expect(() => {
      runCli({
        write(chunk) {
          chunks.push(chunk);
        }
      });
    }).not.toThrow();

    expect(chunks).toEqual([`${startupMessage}\n`]);
  });
});
