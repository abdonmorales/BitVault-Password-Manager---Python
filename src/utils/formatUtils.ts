// formatUtils.ts

/**
 * Formats a Date object into a readable string with support for different formats and time zones.
 * @param date - The Date object to be formatted.
 * @param format - The desired format string.
 * @param timeZone - The time zone to be used for formatting.
 * @returns A formatted date string.
 */
export const formatDate = (date: Date, format: string = 'YYYY-MM-DD HH:mm:ss', timeZone: string = 'UTC'): string => {
	const options: Intl.DateTimeFormatOptions = {};

	// Mapping format string to Intl.DateTimeFormatOptions
	if (format.includes('YYYY')) options.year = 'numeric';
	if (format.includes('MM')) options.month = '2-digit';
	if (format.includes('DD')) options.day = '2-digit';
	if (format.includes('HH')) options.hour = '2-digit';
	if (format.includes('mm')) options.minute = '2-digit';
	if (format.includes('ss')) options.second = '2-digit';

	return new Intl.DateTimeFormat('en-US', { ...options, timeZone }).format(date);
};

/**
 * Other formatting functions can be added here as needed,
 * such as number formatting, currency formatting, etc.
 */
