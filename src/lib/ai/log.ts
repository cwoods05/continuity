import { access, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { AI_DIRECTORY_NAME } from "./templates.js";

export interface LogEntryOptions {
  focus: string;
  changes: string;
  decisions: string;
  next: string;
  date?: string;
}

export interface LogResult {
  entryAdded: string;
  filePath: string;
}

const SESSION_LOG_FILENAME = "SESSION_LOG.md";

const SESSION_LOG_HEADER = `# Session Log

Chronological record of AI-assisted work sessions. Keep entries brief and actionable.

## Log
`;

function formatDate(date?: string): string {
  if (date) {
    return date;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildEntry(options: LogEntryOptions): string {
  const date = formatDate(options.date);

  return `### ${date} — ${options.focus}

**Focus:** ${options.focus}

**Changes:** ${options.changes}

**Decisions:** ${options.decisions}

**Next:** ${options.next}

---`;
}

export async function appendSessionEntry(
  targetDirectory: string,
  options: LogEntryOptions,
): Promise<LogResult> {
  const aiDirectory = path.resolve(targetDirectory, AI_DIRECTORY_NAME);

  try {
    await access(aiDirectory);
  } catch {
    throw new Error(
      `No /ai directory found at ${aiDirectory}. Run continuity init first.`,
    );
  }

  const filePath = path.join(aiDirectory, SESSION_LOG_FILENAME);
  let currentContent: string;

  try {
    currentContent = await readFile(filePath, "utf8");
  } catch {
    currentContent = SESSION_LOG_HEADER;
    await writeFile(filePath, SESSION_LOG_HEADER, "utf8");
  }

  const entry = buildEntry(options);
  const trimmedContent = currentContent.trimEnd();
  const separator = trimmedContent.length > 0 ? "\n\n" : "";
  const updatedContent = `${trimmedContent}${separator}${entry}\n`;

  await writeFile(filePath, updatedContent, "utf8");

  return {
    entryAdded: entry,
    filePath,
  };
}
