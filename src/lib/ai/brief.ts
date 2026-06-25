import { readFile } from "node:fs/promises";
import path from "node:path";
import { extractLastSessionEntry } from "./session.js";
import { AI_DIRECTORY_NAME } from "./templates.js";

export interface BriefOptions {
  includeRules: boolean;
  only?: string[];
}

export interface BriefResult {
  content: string;
  sectionsIncluded: string[];
  sectionsSkipped: string[];
}

interface SectionDef {
  key: string;
  filename: string;
  header: string;
  useSessionExtract?: boolean;
}

const SECTIONS: readonly SectionDef[] = [
  { key: "project", filename: "PROJECT.md", header: "--- Project ---" },
  { key: "arch", filename: "ARCHITECTURE.md", header: "--- Architecture ---" },
  { key: "tasks", filename: "TASKS.md", header: "--- Active Tasks ---" },
  {
    key: "decisions",
    filename: "DECISIONS.md",
    header: "--- Recent Decisions ---",
  },
  { key: "rules", filename: "AGENT_RULES.md", header: "--- Agent Rules ---" },
  {
    key: "log",
    filename: "SESSION_LOG.md",
    header: "--- Last Session ---",
    useSessionExtract: true,
  },
];

function isEmptyOrTemplateOnly(content: string): boolean {
  const trimmed = content.trim();

  if (trimmed.endsWith("_Add decisions below as they are made._")) {
    return true;
  }

  if (trimmed.endsWith("_Add session entries below._")) {
    return true;
  }

  const lines = trimmed.split("\n");
  const withoutH1 = lines
    .filter((line, i) => !(i === 0 && /^#\s/.test(line)))
    .join("\n")
    .trim();

  if (withoutH1.length < 30) {
    return true;
  }

  return false;
}

function shouldIncludeSection(
  section: SectionDef,
  options: BriefOptions,
): boolean {
  if (section.key === "rules" && !options.includeRules) {
    return false;
  }

  if (options.only && options.only.length > 0) {
    return options.only.includes(section.key);
  }

  return true;
}

export async function generateBrief(
  targetDirectory: string,
  options: BriefOptions,
): Promise<BriefResult> {
  const aiDirectory = path.resolve(targetDirectory, AI_DIRECTORY_NAME);
  const sectionsIncluded: string[] = [];
  const sectionsSkipped: string[] = [];
  const renderedSections: string[] = [];

  for (const section of SECTIONS) {
    if (!shouldIncludeSection(section, options)) {
      sectionsSkipped.push(section.key);
      continue;
    }

    const filePath = path.join(aiDirectory, section.filename);
    let rawContent: string;

    try {
      rawContent = await readFile(filePath, "utf8");
    } catch {
      sectionsSkipped.push(section.key);
      continue;
    }

    let content: string;
    if (section.useSessionExtract) {
      const entry = extractLastSessionEntry(rawContent);
      if (entry === null) {
        sectionsSkipped.push(section.key);
        continue;
      }
      content = entry;
    } else {
      if (isEmptyOrTemplateOnly(rawContent)) {
        sectionsSkipped.push(section.key);
        continue;
      }
      content = rawContent.trim();
    }

    sectionsIncluded.push(section.key);
    renderedSections.push(`${section.header}\n${content}`);
  }

  const parts = [
    "=== Continuity Brief ===",
    `Generated: ${new Date().toISOString()}`,
    ...renderedSections,
    "=== End Brief ===",
  ];

  return {
    content: parts.join("\n\n"),
    sectionsIncluded,
    sectionsSkipped,
  };
}
