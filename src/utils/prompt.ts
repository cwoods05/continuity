import * as readline from "node:readline/promises";

let rl: readline.Interface | null = null;

function getInterface(): readline.Interface {
  if (!rl) {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  return rl;
}

export async function ask(question: string): Promise<string> {
  const answer = await getInterface().question(question);
  const trimmed = answer.trim();

  if (trimmed.length === 0) {
    throw new Error(`Empty answer for: ${question}`);
  }

  return trimmed;
}

export function closePrompt(): void {
  if (rl) {
    rl.close();
    rl = null;
  }
}
