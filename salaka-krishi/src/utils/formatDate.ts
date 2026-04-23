// Utility to format dates like "Jun 25th"
export function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });

  // Add "st", "nd", "rd", "th"
  let suffix = "th";
  if (day === 1 || day === 21 || day === 31) suffix = "st";
  else if (day === 2 || day === 22) suffix = "nd";
  else if (day === 3 || day === 23) suffix = "rd";

  return `${month} ${day}${suffix}`;
}

// Format a range: start - end
export function formatDateRange(start: string, end: string) {
  if (!start || !end) return "N/A";
  return `${formatDate(start)} - ${formatDate(end)}`;
}

// Calculate estimated delivery date
export function getEstimatedDeliveryDate(daysToAdd: number) {
  const date = new Date();
  date.setDate(date.getDate() + daysToAdd);
  return formatDate(date.toISOString());
}


// Get estimated delivery range string
export function getEstimatedDeliveryRange(minDays: number = 2, maxDays: number = 4) {
  const minDate = getEstimatedDeliveryDate(minDays);
  const maxDate = getEstimatedDeliveryDate(maxDays);
  return `${minDate} - ${maxDate}`;
}
