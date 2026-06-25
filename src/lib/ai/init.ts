import path from "node:path";
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
