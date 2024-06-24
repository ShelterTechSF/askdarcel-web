/**
 * This function strips markdown characters * and # to avoid a11y issues in adding unnecessary headers to the site. Maintains line breaks for formatting.
 *
 * E.g.
 * '# **Service Contact Information:**\n' -> 'Service Contact Information:'
 */
export function removeAsterisksAndHashes(input: string): string {
  // Remove all asterisks and hash symbols
  return input.replace(/[#]/g, "");
}
