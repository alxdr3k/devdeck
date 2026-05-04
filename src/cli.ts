import { runCli } from "./cli-core.js";

type WritableOutput = {
  write(chunk: string): unknown;
};

declare const process: {
  stdout: WritableOutput;
};

runCli(process.stdout);
