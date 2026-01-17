/**
 * API Client
 *
 * Handles requests to the Visitor Tracker API.
 */

const API_BASE = '/api';

interface ApiResponse<T = unknown> {
  success?: boolean;
  error?: string;
  data?: T;
  [key: string]: unknown;
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data: ApiResponse<T> = await response.json();

  if (!response.ok || data.error) {
    throw new Error(data.error || 'API request failed');
  }

  return data as T;
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint),

  post: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T>(endpoint: string, body: unknown) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  delete: <T>(endpoint: string) =>
    request<T>(endpoint, {
      method: 'DELETE',
    }),
};

// Type definitions for API responses
export interface Visitor {
  id: number;
  visitor_token: string;
  alias: string | null;
  ip_address: string | null;
  last_seen: string;
  os?: string | null;
  browser?: string | null;
  screen_width?: number | null;
  screen_height?: number | null;
  current_page?: {
    url: string;
    title: string | null;
    project: string;
    domain: string;
    entered_at: string;
  };
}

export interface Project {
  id: number;
  name: string;
  domain: string;
  enabled: number;
  notification_browser: number;
  notification_ntfy: number;
  notification_sound: number;
  ntfy_topic: string | null;
  active_visitors?: number;
  created_at: string;
  updated_at: string;
}

export interface VisitorsResponse {
  visitors: Visitor[];
}

export interface ProjectsResponse {
  projects: Project[];
}
