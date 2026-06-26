import path from "node:path";
import { writeFile } from "node:fs/promises";
import {
  AI_DIRECTORY_NAME,
  AI_FILE_TEMPLATES,
} from "./templates.js";
import {
  ensureDirectory,
  writeFileIfMissing,
} from "../../utils/filesystem.js";

export interface InitResult {
  aiDirectory: string;
  createdDirectory: boolean;
  createdFiles: string[];
  skippedFiles: string[];
}

export interface InteractiveProjectAnswers {
  projectName: string;
  description: string;
  stack: string;
}

export async function writeInteractiveProjectFile(
  targetDirectory: string,
  answers: InteractiveProjectAnswers,
): Promise<void> {
  const filePath = path.join(
    path.resolve(targetDirectory, AI_DIRECTORY_NAME),
    "PROJECT.md",
  );

  const content = `# Project

## Overview

${answers.projectName} — ${answers.description}

## Stack

${answers.stack}

## Goals

_Add your project goals here._

## Non-Goals

_Add what this project explicitly does not do._

## Key Constraints

_Add technical or product constraints here._
`;

  await writeFile(filePath, content, "utf8");
}

export async function initializeAiDirectory(
  targetDirectory: string,
): Promise<InitResult> {
  const aiDirectory = path.resolve(targetDirectory, AI_DIRECTORY_NAME);
  const createdDirectory = await ensureDirectory(aiDirectory);

  const createdFiles: string[] = [];
  const skippedFiles: string[] = [];

  for (const template of AI_FILE_TEMPLATES) {
    const filePath = path.join(aiDirectory, template.filename);
    const created = await writeFileIfMissing(filePath, template.content);

    if (created) {
      createdFiles.push(filePath);
    } else {
      skippedFiles.push(filePath);
    }
  }

  return {
    aiDirectory,
    createdDirectory,
    createdFiles,
    skippedFiles,
  };
}
