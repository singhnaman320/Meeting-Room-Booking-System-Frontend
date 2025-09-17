import { format } from 'date-fns';

// Convert datetime-local input value to proper Date object
export const parseLocalDateTime = (datetimeLocalValue) => {
  if (!datetimeLocalValue) return null;
  
  // datetime-local format: YYYY-MM-DDTHH:mm
  // We need to treat this as local time, not UTC
  const [datePart, timePart] = datetimeLocalValue.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);
  
  // Create date in local timezone
  return new Date(year, month - 1, day, hours, minutes);
};

// Convert Date object to datetime-local input format
export const formatForDateTimeLocal = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Format time for display, ensuring local timezone
export const formatDisplayTime = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'HH:mm');
};

// Format date and time for display
export const formatDisplayDateTime = (dateString) => {
  const date = new Date(dateString);
  return format(date, 'MMM dd, HH:mm');
};
