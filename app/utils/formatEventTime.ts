export default function formatEventTime(dateToFormat: Date | undefined) {
  const date = new Date(dateToFormat || "");

  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return {
    date: formattedDate,
    time: formattedTime,
  };
}
