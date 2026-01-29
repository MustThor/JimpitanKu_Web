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

// Get week info based on calendar system (week Monday-Sunday, belongs to the month where MONDAY falls)
export interface WeekInfo {
  weekNumber: number;
  month: number;  // 1-12
  year: number;
}

export const getWeekInfo = (date: Date): WeekInfo => {
  // Find the Monday of the week this date belongs to (start of week in Monday-Sunday system)
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const mondayDate = new Date(date);
  if (dayOfWeek === 0) {
    // Sunday - go back 6 days to Monday
    mondayDate.setDate(date.getDate() - 6);
  } else if (dayOfWeek === 1) {
    // Already Monday, no change needed
  } else {
    // Go back to Monday (dayOfWeek - 1 days)
    mondayDate.setDate(date.getDate() - (dayOfWeek - 1));
  }
  
  // The week "belongs" to the month where the Monday (start of week) falls
  const mondayMonth = mondayDate.getMonth() + 1; // 1-12
  const mondayYear = mondayDate.getFullYear();
  
  // Calculate which week number within that month
  // Find the first Monday of the Monday's month
  const firstDayOfMondayMonth = new Date(mondayYear, mondayMonth - 1, 1);
  const firstDayOfWeek = firstDayOfMondayMonth.getDay(); // 0 = Sunday
  
  // Find the first Monday of that month
  let firstMondayDate: number;
  if (firstDayOfWeek === 0) {
    // Month starts on Sunday, first Monday is the 2nd
    firstMondayDate = 2;
  } else if (firstDayOfWeek === 1) {
    // Month starts on Monday
    firstMondayDate = 1;
  } else {
    // Find next Monday
    firstMondayDate = 1 + (8 - firstDayOfWeek);
  }
  
  const mondayDayOfMonth = mondayDate.getDate();
  
  let weekNumber: number;
  if (mondayDayOfMonth < firstMondayDate) {
    // This Monday is before the first Monday of the month - it's part of last week of previous month
    // This shouldn't happen normally since we're looking at the Monday's month
    weekNumber = 1;
  } else {
    // Calculate week number based on how many complete weeks since first Monday
    weekNumber = Math.ceil((mondayDayOfMonth - firstMondayDate + 1) / 7);
  }
  
  return { weekNumber, month: mondayMonth, year: mondayYear };
};

// Legacy function - returns just week number for backward compatibility
export const getWeekNumber = (date: Date): number => {
  return getWeekInfo(date).weekNumber;
};

export const getMonthAndYear = (date: Date): { month: number; year: number } => {
  // Returns the month/year based on the week's Monday
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
  
  // If month doesn't start on Monday, include the partial week from previous month
  // This week belongs to the PREVIOUS month (where Monday falls)
  if (firstDayOfMonth.getDay() !== 1) {
    // Find the Monday that starts this partial week (in previous month)
    const prevMonday = new Date(firstDayOfMonth);
    const dayOfWeek = firstDayOfMonth.getDay();
    if (dayOfWeek === 0) {
      // Sunday - go back 6 days to Monday
      prevMonday.setDate(1 - 6);
    } else {
      // Go back to Monday (dayOfWeek - 1 days)
      prevMonday.setDate(1 - (dayOfWeek - 1));
    }
    
    const weekEnd = new Date(prevMonday);
    weekEnd.setDate(prevMonday.getDate() + 6); // Sunday
    
    const weekInfo = getWeekInfo(prevMonday); // Week belongs to month where MONDAY falls
    
    weeks.push({
      weekNumber: weekInfo.weekNumber,
      belongsToMonth: weekInfo.month,
      belongsToYear: weekInfo.year,
      startDate: new Date(prevMonday),
      endDate: weekEnd,
      label: `Minggu ${weekInfo.weekNumber} ${MONTH_NAMES[weekInfo.month]} (${prevMonday.getDate()}-${weekEnd.getDate()})`
    });
  }
  
  // Find the first Monday on or after the first day of the month
  let currentMonday = new Date(firstDayOfMonth);
  const firstDayOfWeek = currentMonday.getDay();
  if (firstDayOfWeek !== 1) {
    if (firstDayOfWeek === 0) {
      // Sunday - next Monday is tomorrow
      currentMonday.setDate(currentMonday.getDate() + 1);
    } else {
      // Move forward to next Monday
      currentMonday.setDate(currentMonday.getDate() + (8 - firstDayOfWeek));
    }
  }
  
  // Iterate through all Mondays in this month
  while (currentMonday <= lastDayOfMonth) {
    const weekEnd = new Date(currentMonday);
    weekEnd.setDate(currentMonday.getDate() + 6); // Sunday
    
    const weekInfo = getWeekInfo(currentMonday); // Week belongs to month where MONDAY falls
    
    // Only include if the Monday falls in the current month
    if (weekInfo.month === month && weekInfo.year === year) {
      const displayStart = currentMonday.getDate();
      const displayEnd = weekEnd.getMonth() === month - 1 ? weekEnd.getDate() : weekEnd.getDate();
      
      weeks.push({
        weekNumber: weekInfo.weekNumber,
        belongsToMonth: weekInfo.month,
        belongsToYear: weekInfo.year,
        startDate: new Date(currentMonday),
        endDate: weekEnd,
        label: `Minggu ${weekInfo.weekNumber} (${displayStart}-${displayEnd})`
      });
    }
    
    // Move to next Monday
    currentMonday.setDate(currentMonday.getDate() + 7);
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
