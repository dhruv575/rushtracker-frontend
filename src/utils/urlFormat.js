// src/utils/urlFormat.js

/**
 * Formats a string to be URL-friendly
 * @param {string} str - The string to format
 * @returns {string} URL-friendly string
 */
export const formatForUrl = (str) => {
    return str
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };
  
  /**
   * Reverses URL formatting to get original string
   * @param {string} urlStr - The URL-formatted string
   * @returns {string} Original string (approximately)
   */
  export const unformatFromUrl = (urlStr) => {
    return urlStr
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };