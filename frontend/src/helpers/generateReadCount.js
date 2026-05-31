/**
 * Generate a deterministic fake read count from a slug string.
 * Returns a number between 1 and 99,999.
 *
 * @param {string} slug - The article slug
 * @returns {number} Fake read count
 */
export function generateReadCount(slug) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    const char = slug.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash % 99999) + 1;
}
