import { readFile } from "node:fs/promises";
import path from "node:path";
import { extractLastSessionEntry } from "./session.js";
import {
  AI_DIRECTORY_NAME,
  SECTIONS,
} from "./templates.js";
import { isEmptyOrTemplateOnly } from "./content.js";

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

export async function runDoctor(targetDirectory: string): Promise<DoctorResult> {
  const aiDirectory = path.resolve(targetDirectory, AI_DIRECTORY_NAME);
  const reports: FileReport[] = [];

  for (const section of SECTIONS) {
    const filePath = path.join(aiDirectory, section.filename);
    let rawContent: string;

    try {
      rawContent = await readFile(filePath, "utf8");
    } catch {
      reports.push({
        filename: section.filename,
        sectionKey: section.key,
        status: "missing",
        reason: "file not found",
      });
      continue;
    }

    if (section.useSessionExtract) {
      if (extractLastSessionEntry(rawContent) === null) {
        reports.push({
          filename: section.filename,
          sectionKey: section.key,
          status: "empty",
          reason: "contains only placeholder text",
        });
        continue;
      }
    } else if (isEmptyOrTemplateOnly(rawContent)) {
      reports.push({
        filename: section.filename,
        sectionKey: section.key,
        status: "empty",
        reason: "contains only placeholder text",
      });
      continue;
    }

    reports.push({
      filename: section.filename,
      sectionKey: section.key,
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
