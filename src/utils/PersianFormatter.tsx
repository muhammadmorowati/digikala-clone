export const formatDateToPersian = (input: string | number | Date): string => {
  if (!input) return "";

  // Convert input to Date safely
  const date = input instanceof Date ? input : new Date(input);

  if (isNaN(date.getTime())) {
    console.warn("❗ Invalid date passed to formatDateToPersian:", input);
    return "";
  }

  const dateFormatter = new Intl.DateTimeFormat("fa-IR", {
    calendar: "persian",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${dateFormatter.format(date)} | ${timeFormatter.format(date)}`;
};
