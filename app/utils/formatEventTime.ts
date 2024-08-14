export default function formatEventTime(time: string) {
  return new Date(time).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}
