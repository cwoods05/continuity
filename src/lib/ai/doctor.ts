import { readFile } from "node:fs/promises";
import path from "node:path";
import { extractLastSessionEntry } from "./session.js";
import { AI_DIRECTORY_NAME } from "./templates.js";

export type FileStatus = "healthy" | "empty" | "missing";

export interface FileReport {
  filename: string;
  sectionKey: string;
  status: FileStatus;
  reason?: string;
}

export interface DoctorResult {
  reports: FileReport[];
  healthyCount: number;
  emptyCount: number;
  missingCount: number;
  allHealthy: boolean;
}

interface FileDef {
  filename: string;
  sectionKey: string;
  useSessionExtract?: boolean;
}

const FILES: readonly FileDef[] = [
  { filename: "PROJECT.md", sectionKey: "project" },
  { filename: "ARCHITECTURE.md", sectionKey: "arch" },
  { filename: "TASKS.md", sectionKey: "tasks" },
  { filename: "DECISIONS.md", sectionKey: "decisions" },
  { filename: "AGENT_RULES.md", sectionKey: "rules" },
  { filename: "SESSION_LOG.md", sectionKey: "log", useSessionExtract: true },
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

export async function runDoctor(targetDirectory: string): Promise<DoctorResult> {
  const aiDirectory = path.resolve(targetDirectory, AI_DIRECTORY_NAME);
  const reports: FileReport[] = [];

  for (const file of FILES) {
    const filePath = path.join(aiDirectory, file.filename);
    let rawContent: string;

    try {
      rawContent = await readFile(filePath, "utf8");
    } catch {
      reports.push({
        filename: file.filename,
        sectionKey: file.sectionKey,
        status: "missing",
        reason: "file not found",
      });
      continue;
    }

    if (file.useSessionExtract) {
      if (extractLastSessionEntry(rawContent) === null) {
        reports.push({
          filename: file.filename,
          sectionKey: file.sectionKey,
          status: "empty",
          reason: "contains only placeholder text",
        });
        continue;
      }
    } else if (isEmptyOrTemplateOnly(rawContent)) {
      reports.push({
        filename: file.filename,
        sectionKey: file.sectionKey,
        status: "empty",
        reason: "contains only placeholder text",
      });
      continue;
    }

    reports.push({
      filename: file.filename,
      sectionKey: file.sectionKey,
      status: "healthy",
    });
  }

  const healthyCount = reports.filter((r) => r.status === "healthy").length;
  const emptyCount = reports.filter((r) => r.status === "empty").length;
  const missingCount = reports.filter((r) => r.status === "missing").length;

  return {
    reports,
    healthyCount,
    emptyCount,
    missingCount,
    allHealthy: healthyCount === reports.length,
  };
}
