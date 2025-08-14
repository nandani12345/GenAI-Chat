export function sanitize(text) {
  return text.replace(/\n/g, " ").trim();
}
