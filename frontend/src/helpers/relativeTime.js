/**
 * Converts a date string/number to a human-readable relative time string.
 * e.g. "Last edited 3 hours ago", "Last edited 2 days ago", "Last edited just now"
 */
export default function relativeTime(date) {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffMonth = Math.floor(diffDay / 30);

  if (diffMonth > 0) {
    return "Last edited " + diffMonth + " month" + (diffMonth > 1 ? "s" : "") + " ago";
  }
  if (diffDay > 0) {
    return "Last edited " + diffDay + " day" + (diffDay > 1 ? "s" : "") + " ago";
  }
  if (diffHour > 0) {
    return "Last edited " + diffHour + " hour" + (diffHour > 1 ? "s" : "") + " ago";
  }
  if (diffMin > 0) {
    return "Last edited " + diffMin + " minute" + (diffMin > 1 ? "s" : "") + " ago";
  }
  return "Last edited just now";
}
