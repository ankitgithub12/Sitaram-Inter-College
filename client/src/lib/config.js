/**
 * SRIC Client Configuration
 * All environment-specific URLs are centralised here.
 * Import these constants instead of hardcoding URLs anywhere.
 */

export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

/**
 * Build a full API URL.
 * In development, Vite's proxy handles /api → localhost:5000,
 * so we use relative paths by default.
 * In production, use the full base URL.
 */
export const apiUrl = (path) => {
  // In dev mode, Vite proxy handles /api/* → backend
  // In production, prepend VITE_API_BASE_URL
  if (import.meta.env.DEV) {
    return path; // e.g. '/api/gallery'
  }
  return `${API_BASE}${path}`;
};
