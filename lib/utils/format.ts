export const formatRupiah = (number: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatShortDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Get week info based on calendar system (week belongs to the month where Sunday falls)
export interface WeekInfo {
  weekNumber: number;
  month: number;  // 1-12
  year: number;
}

export const getWeekInfo = (date: Date): WeekInfo => {
  // Find the Sunday of the week this date belongs to
  const dayOfWeek = date.getDay(); // 0 = Sunday
  const sundayDate = new Date(date);
  sundayDate.setDate(date.getDate() - dayOfWeek);
  
  // The week "belongs" to the month where the Sunday falls
  const sundayMonth = sundayDate.getMonth() + 1; // 1-12
  const sundayYear = sundayDate.getFullYear();
  
  // Calculate which week number within that month
  const firstDayOfSundayMonth = new Date(sundayYear, sundayMonth - 1, 1);
  const firstDayOfWeek = firstDayOfSundayMonth.getDay();
  const sundayDayOfMonth = sundayDate.getDate();
  
  let weekNumber: number;
  if (firstDayOfWeek === 0) {
    // Month starts on Sunday
    weekNumber = Math.ceil(sundayDayOfMonth / 7);
  } else {
    // Find the first Sunday of that month
    const firstSundayDate = 8 - firstDayOfWeek;
    weekNumber = Math.ceil((sundayDayOfMonth - firstSundayDate) / 7) + 1;
  }
  
  return { weekNumber, month: sundayMonth, year: sundayYear };
};

// Legacy function - returns just week number for backward compatibility
export const getWeekNumber = (date: Date): number => {
  return getWeekInfo(date).weekNumber;
};

export const getMonthAndYear = (date: Date): { month: number; year: number } => {
  // Returns the month/year based on the week's Sunday
  const weekInfo = getWeekInfo(date);
  return { month: weekInfo.month, year: weekInfo.year };
};

// Get all calendar weeks for a given month view
export interface CalendarWeek {
  weekNumber: number;
  belongsToMonth: number;
  belongsToYear: number;
  startDate: Date;
  endDate: Date;
  label: string;
}

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export const getCalendarWeeksForMonth = (month: number, year: number): CalendarWeek[] => {
  const weeks: CalendarWeek[] = [];
  
  // Start from the first day of the month
  const firstDayOfMonth = new Date(year, month - 1, 1);
  const lastDayOfMonth = new Date(year, month, 0);
  
  // If month doesn't start on Sunday, include the partial week from previous month
  if (firstDayOfMonth.getDay() !== 0) {
    // Find the Sunday that starts this partial week
    const prevSunday = new Date(firstDayOfMonth);
    prevSunday.setDate(1 - firstDayOfMonth.getDay());
    
    const weekInfo = getWeekInfo(prevSunday);
    const weekEnd = new Date(prevSunday);
    weekEnd.setDate(prevSunday.getDate() + 6);
    
    weeks.push({
      weekNumber: weekInfo.weekNumber,
      belongsToMonth: weekInfo.month,
      belongsToYear: weekInfo.year,
      startDate: prevSunday,
      endDate: weekEnd,
      label: `Minggu ${weekInfo.weekNumber} ${MONTH_NAMES[weekInfo.month]} (${prevSunday.getDate()}-${weekEnd.getDate()})`
    });
  }
  
  // Find the first Sunday on or after the first day of the month
  let currentSunday = new Date(firstDayOfMonth);
  if (currentSunday.getDay() !== 0) {
    currentSunday.setDate(currentSunday.getDate() + (7 - currentSunday.getDay()));
  }
  
  // Iterate through all Sundays in this month
  while (currentSunday <= lastDayOfMonth) {
    const weekInfo = getWeekInfo(currentSunday);
    const weekEnd = new Date(currentSunday);
    weekEnd.setDate(currentSunday.getDate() + 6);
    
    const displayStart = currentSunday.getDate();
    const displayEnd = weekEnd.getMonth() === month - 1 ? weekEnd.getDate() : lastDayOfMonth.getDate();
    
    weeks.push({
      weekNumber: weekInfo.weekNumber,
      belongsToMonth: weekInfo.month,
      belongsToYear: weekInfo.year,
      startDate: new Date(currentSunday),
      endDate: weekEnd,
      label: `Minggu ${weekInfo.weekNumber} (${displayStart}-${displayEnd})`
    });
    
    // Move to next Sunday
    currentSunday.setDate(currentSunday.getDate() + 7);
  }
  
  return weeks;
};

// Legacy function for backward compatibility
export const getWeekDateRange = (weekNumber: number, month: number, year: number): { start: number; end: number } => {
  const weeks = getCalendarWeeksForMonth(month, year);
  const week = weeks.find(w => w.weekNumber === weekNumber && w.belongsToMonth === month);
  if (week) {
    return { 
      start: week.startDate.getDate(), 
      end: week.endDate.getMonth() === month - 1 ? week.endDate.getDate() : new Date(year, month, 0).getDate()
    };
  }
  return { start: 1, end: 7 };
};
