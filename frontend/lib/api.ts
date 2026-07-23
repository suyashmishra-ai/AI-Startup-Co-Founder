import { AuthResponse, User, Project, Analysis, StartupBlueprint } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getAuthHeader(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (res.status === 401 && path !== '/auth/login' && path !== '/auth/register') {
    // Attempt token refresh
    const refreshToken = localStorage.getItem('refresh_token');
    if (refreshToken) {
      try {
        const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: refreshToken }),
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          localStorage.setItem('access_token', data.tokens.access_token);
          localStorage.setItem('refresh_token', data.tokens.refresh_token);

          // Retry original request
          const retryHeaders = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${data.tokens.access_token}`,
            ...(options.headers || {}),
          };
          const retryRes = await fetch(`${API_URL}${path}`, {
            ...options,
            headers: retryHeaders,
          });

          if (!retryRes.ok) {
            const error = await retryRes.json().catch(() => ({ detail: 'API Request Failed' }));
            throw new Error(error.detail || 'API Request Failed');
          }
          return retryRes.json();
        }
      } catch (e) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        if (typeof window !== 'undefined') window.location.href = '/login';
      }
    }
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: 'API Request Failed' }));
    throw new Error(error.detail || `Request failed with status ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  register: (data: { email: string; password: str; name?: string }) =>
    request<AuthResponse>('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: str }) =>
    request<AuthResponse>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  me: () => request<User>('/auth/me'),

  logout: async () => {
    try {
      await request<{ success: boolean }>('/auth/logout', { method: 'POST' });
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  },

  // Projects
  getProjects: () => request<Project[]>('/projects'),

  createProject: (data: {
    name: string;
    idea: string;
    industry: string;
    audience?: string;
    country?: string;
    budget?: string;
    team?: string;
    stage?: string;
    goal: string;
  }) => request<Project>('/projects', { method: 'POST', body: JSON.stringify(data) }),

  getProject: (id: string) => request<Project>(`/projects/${id}`),

  patchProject: (id: string, data: Partial<Project>) =>
    request<Project>(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),

  deleteProject: (id: string) =>
    request<{ success: boolean }>(`/projects/${id}`, { method: 'DELETE' }),

  analyzeProject: (
    id: string,
    inputs: {
      idea: string;
      industry: string;
      audience?: string;
      country?: string;
      budget?: string;
      team?: string;
      stage?: string;
      goal: string;
    }
  ) =>
    request<Analysis>(`/projects/${id}/analyze`, { method: 'POST', body: JSON.stringify(inputs) }),

  getProjectAnalyses: (id: string) => request<Analysis[]>(`/projects/${id}/analyses`),

  // Analyses
  getAnalysis: (id: string) => request<Analysis>(`/analyses/${id}`),

  downloadReportUrl: (id: string) => `${API_URL}/analyses/${id}/report?format=md`,
};
