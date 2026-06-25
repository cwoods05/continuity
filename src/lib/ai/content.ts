export function isEmptyOrTemplateOnly(content: string): boolean {
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
