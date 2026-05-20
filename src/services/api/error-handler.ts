export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(params: {
    message: string;
    status: number;
    code?: string;
    details?: unknown;
  }) {
    super(params.message);
    this.name = 'ApiError';
    this.status = params.status;
    this.code = params.code;
    this.details = params.details;
  }
}

export async function parseApiError(response: Response): Promise<ApiError> {
  let payload: any = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  return new ApiError({
    message:
      payload?.error?.message ||
      payload?.message ||
      `Request failed with status ${response.status}`,
    status: response.status,
    code: payload?.error?.code,
    details: payload?.error?.details || payload
  });
}
