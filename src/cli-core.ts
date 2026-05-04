type WritableOutput = {
  write(chunk: string): unknown;
};

export const startupMessage = "DevDeck scaffold ready.";

export function runCli(output: WritableOutput): void {
  output.write(`${startupMessage}\n`);
}
