/**
 * Sanity text field returns /n which is not readable by dangerouslySetHTML. This functions turns /n into <br>.
 *
 * E.g.
 * '555-555-5555' -> +15555555555
 */
export function htmlWithBreaks(htmlString: string) {
  return htmlString.replace(/\n/g, "<br>");
}
