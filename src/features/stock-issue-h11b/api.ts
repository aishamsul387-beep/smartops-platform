import {
  H11BContextResponse,
  H11BIssueListResponse,
  H11BIssueRecord,
  H11BPreviewRequest,
  H11BPreviewResponse,
} from './types';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

async function apiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    cache: 'no-store',
  });

  let data: any = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || `Request failed (${response.status})`);
  }

  return data as T;
}

export function getH11BContext() {
  return apiRequest<H11BContextResponse>('/stock-control/issues-h11b/context');
}

export function previewH11BIssue(payload: H11BPreviewRequest) {
  return apiRequest<H11BPreviewResponse>('/stock-control/issues-h11b/preview', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function createH11BIssue(payload: H11BPreviewRequest) {
  return apiRequest<{ issue: H11BIssueRecord }>('/stock-control/issues-h11b', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function listH11BIssues(q = '') {
  const query = q ? `?q=${encodeURIComponent(q)}` : '';
  return apiRequest<H11BIssueListResponse>(`/stock-control/issues-h11b${query}`);
}

export function getH11BIssue(issueId: string) {
  return apiRequest<{ issue: H11BIssueRecord }>(`/stock-control/issues-h11b/${issueId}`);
}

export function getH11BPrint(issueId: string) {
  return apiRequest<{ issue: H11BIssueRecord }>(`/stock-control/issues-h11b/${issueId}/print`);
}
