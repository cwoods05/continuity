import { readFile } from "node:fs/promises";
import path from "node:path";
import { extractLastSessionEntry } from "./session.js";
import {
  AI_DIRECTORY_NAME,
  SECTIONS,
  type SectionDef,
} from "./templates.js";
import { isEmptyOrTemplateOnly } from "./content.js";

export interface BriefOptions {
  includeRules: boolean;
  only?: string[];
}

export interface BriefResult {
  content: string;
  sectionsIncluded: string[];
  sectionsSkipped: string[];
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
