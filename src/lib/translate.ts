// MyMemory's translation API — free, keyless, CORS-open. Fine for short
// travel phrases; not meant for heavy volume (anonymous cap ~1000 words/day).
export async function translateText(
  text: string,
  sourceCode: string,
  targetCode: string,
): Promise<string> {
  if (!text.trim()) return "";
  if (sourceCode === targetCode) return text;
  const params = new URLSearchParams({ q: text, langpair: `${sourceCode}|${targetCode}` });
  const res = await fetch(`https://api.mymemory.translated.net/get?${params}`);
  if (!res.ok) throw new Error("Translation service is unavailable right now.");
  const data = await res.json();
  const translated = data?.responseData?.translatedText;
  if (!translated || typeof translated !== "string") {
    throw new Error("Couldn't translate that — try shorter text.");
  }
  return translated;
}
