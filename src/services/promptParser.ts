// src/services/promptParser.ts

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'with', 'wearing', 'and', 'has', 'of', 'in', 'on', 'is'
]);

/**
 * Parses a raw text prompt into a clean array of keywords.
 * @param prompt The user-inputted string.
 * @returns An array of lowercase keywords with stop words removed.
 */
export const parsePrompt = (prompt: string): string[] => {
  if (!prompt) return [];

  return prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 0 && !STOP_WORDS.has(word));
};
