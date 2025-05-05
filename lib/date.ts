export const convertToISODate = (dateStr: string) => {
    // Remove the comma and ordinal suffixes (st, nd, rd, th)
    const cleanStr = dateStr.replace(/,/g, '').replace(/(\d+)(st|nd|rd|th)/, '$1');
    
    // Parse the cleaned string to a Date object
    const parsedDate = new Date(cleanStr);
    
    // Ensure the date is valid
    if (isNaN(parsedDate)) {
      throw new Error('Invalid date format');
    }
  
    // Format the date to YYYY-MM-DD
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
}


export function convertToReadableDate(isoDateStr: string) {
    const date = new Date(isoDateStr);
  
    // Ensure the date is valid
    if (isNaN(date)) {
      throw new Error('Invalid ISO date format');
    }
  
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
  
    const getOrdinal = (n) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
  
    const month = months[date.getMonth()];
    const day = getOrdinal(date.getDate());
    const year = date.getFullYear();
  
    return `${month}, ${day} ${year}`;
}
  
  