export default function formatEventDate(date: string) {
  // The Date constructor is inconsistent depending on the date formatting. For example, it will parse dates formatted
  // as yyyy-mm-dd as UTC. With slashes it will be parsed as "local time" -- not based on actual locale timezone, but
  // perceived relative local time.
  const toFormat = date.replace("-", "/");
  return new Date(toFormat).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
