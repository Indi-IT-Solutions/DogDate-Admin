/**
 * Date utility functions for consistent date formatting across the application
 * Standard format: "Aug 13, 2025"
 */

/**
 * Formats a date string or Date object to the standard application format: "Aug 13, 2025"
 * @param dateInput - Date string, Date object, or timestamp
 * @returns Formatted date string in "Aug 13, 2025" format, or 'N/A' if invalid
 */
export const formatDate = (dateInput: string | Date | number): string => {
    try {
        if (!dateInput) return 'N/A';

        const date = new Date(dateInput);

        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return 'N/A';
        }

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'N/A';
    }
};

/**
 * Formats a date string or Date object to include time: "Aug 13, 2025 at 3:45 PM"
 * @param dateInput - Date string, Date object, or timestamp
 * @returns Formatted date string with time, or 'N/A' if invalid
 */
export const formatDateTime = (dateInput: string | Date | number): string => {
    try {
        if (!dateInput) return 'N/A';

        const date = new Date(dateInput);

        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return 'N/A';
        }

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    } catch (error) {
        console.error('Error formatting date with time:', error);
        return 'N/A';
    }
};

/**
 * Formats a date to relative format (e.g., "2 days ago", "3 hours ago")
 * @param dateInput - Date string, Date object, or timestamp
 * @returns Relative date string or formatted date if too old
 */
export const formatRelativeDate = (dateInput: string | Date | number): string => {
    try {
        if (!dateInput) return 'N/A';

        const date = new Date(dateInput);
        const now = new Date();

        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return 'N/A';
        }

        const diffInMs = now.getTime() - date.getTime();
        const diffInSeconds = Math.floor(diffInMs / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInDays > 7) {
            // If more than 7 days, show formatted date
            return formatDate(date);
        } else if (diffInDays > 0) {
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        } else if (diffInHours > 0) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else if (diffInMinutes > 0) {
            return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        } else {
            return 'Just now';
        }
    } catch (error) {
        console.error('Error formatting relative date:', error);
        return 'N/A';
    }
};

/**
 * Validates if a date string is valid
 * @param dateInput - Date string, Date object, or timestamp
 * @returns boolean indicating if the date is valid
 */
export const isValidDate = (dateInput: string | Date | number): boolean => {
    try {
        if (!dateInput) return false;
        const date = new Date(dateInput);
        return !isNaN(date.getTime());
    } catch {
        return false;
    }
};

/**
 * Get current date in standard format
 * @returns Current date in "Aug 13, 2025" format
 */
export const getCurrentDate = (): string => {
    return formatDate(new Date());
};

/**
 * Parse date and return ISO string for API calls
 * @param dateInput - Date string, Date object, or timestamp
 * @returns ISO date string or null if invalid
 */
export const toISOString = (dateInput: string | Date | number): string | null => {
    try {
        if (!dateInput) return null;
        const date = new Date(dateInput);
        if (isNaN(date.getTime())) return null;
        return date.toISOString();
    } catch {
        return null;
    }
};
