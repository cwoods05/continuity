export function extractLastSessionEntry(content: string): string | null {
  const lines = content.split("\n");
  let lastHeadingIndex = -1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line !== undefined && line.startsWith("### ")) {
      lastHeadingIndex = i;
    }
  }

  if (lastHeadingIndex === -1) {
    return null;
  }

  const afterHeading = lines.slice(lastHeadingIndex + 1).join("\n").trim();
  if (afterHeading === "_Add session entries below._") {
    return null;
  }

  return lines.slice(lastHeadingIndex).join("\n").trim();
}
