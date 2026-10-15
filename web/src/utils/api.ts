export const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || '/api/v1';

export class ApiError extends Error {
  public statusCode: number;
  public errors?: Record<string, string[]>;

  constructor(message: string, statusCode: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'X-Client-App': 'web',
    ...(options.headers || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include', // Send HTTP-only session cookie
  };

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (err: any) {
    throw new ApiError('Unable to connect to GYDE server. Please check your network connection.', 0);
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${response.status}`;
    throw new ApiError(errorMsg, response.status, data?.errors);
  }

  return (data?.data !== undefined ? data.data : data) as T;
}
