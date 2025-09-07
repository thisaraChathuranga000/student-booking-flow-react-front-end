export const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export const TZ_OPTIONS = [
  { value: "Asia/Colombo", label: "India Standard Time" },
  { value: "Asia/Yerevan", label: "Asia/Yerevan" },
  { value: "Asia/Yekaterinburg", label: "Asia/Yekaterinburg" },
  { value: "Asia/Yakutsk", label: "Asia/Yakutsk" },
  { value: "Atlantic/Azores", label: "Azores Time" },
  { value: "Atlantic/Cape_Verde", label: "Cape Verde Time" },
];

export function buildCalendar(year, month) {
  const first = new Date(year, month, 1);
  const start = new Date(first);
  // Monday-start
  const shift = (start.getDay() + 6) % 7;
  start.setDate(start.getDate() - shift);

  const cells = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    cells.push(d);
  }
  return { year, month, cells };
}

export function sameDay(a, b) {
  return (
    a && b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function toKey(d){ 
  return d.toISOString().slice(0,10); 
}

// Format date for API without timezone conversion issues
export function formatDateForAPI(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatRange(date, time, hours) {
  if (!date) return "";
  const [h, m] = time.split(":").map(Number);
  const start = new Date(date);
  start.setHours(h, m || 0, 0, 0);
  const end = new Date(start);
  end.setHours(start.getHours() + hours);
  const fmt = (d) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${fmt(start)} – ${fmt(end)}, ${start.toLocaleDateString(undefined, {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  })}`;
}

// "India Standard Time (12:54)" style
export function zoneLabel(tz) {
  try {
    const d = new Date();
    const t = new Intl.DateTimeFormat([], {
      timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false
    }).format(d);
    const label = TZ_OPTIONS.find(z => z.value === tz)?.label || tz;
    return `${label} (${t})`;
  } catch {
    return tz;
  }
}

// Convert time string like "9.00" or "9:00" to "9:00 AM" format
export function formatTimeToAMPM(timeString) {
  if (!timeString) return "";
  
  // Handle both "9.00" and "9:00" formats
  const normalizedTime = timeString.replace(".", ":");
  const [hourStr, minuteStr = "00"] = normalizedTime.split(":");
  
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  
  if (isNaN(hour) || hour < 0 || hour > 23 || isNaN(minute) || minute < 0 || minute > 59) {
    return timeString; // Return original if invalid
  }
  
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  const displayMinute = minute.toString().padStart(2, "0");
  
  return `${displayHour}:${displayMinute} ${period}`;
}
