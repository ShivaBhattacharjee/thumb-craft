/**
 * Get the Gemini API key from localStorage (BYOK) or fall back to environment variable
 */
export function getGeminiApiKey(): string {
  if (typeof window !== "undefined") {
    const userKey = localStorage.getItem("gemini_api_key");
    if (userKey && userKey.trim()) {
      return userKey.trim();
    }
  }
  
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
}
