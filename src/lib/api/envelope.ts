export type Envelope<T> = {
  success: boolean;
  message?: string | string[] | { message?: string | string[] };
  data?: T;
};

export type Page<T> = {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  lastPage: number;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

function isEnvelope(body: unknown): body is Envelope<unknown> {
  return (
    typeof body === "object" &&
    body !== null &&
    "success" in body &&
    typeof body.success === "boolean"
  );
}

/** Nest sometimes nests `{ message, statusCode }` inside envelope.message. */
export function normalizeApiMessage(message: unknown, fallback = "Request failed"): string {
  if (typeof message === "string" && message.trim()) {
    return message === "[object Object]" ? fallback : message;
  }
  if (Array.isArray(message) && message.length > 0) {
    return message.map((part) => normalizeApiMessage(part, "")).filter(Boolean).join("; ") || fallback;
  }
  if (message && typeof message === "object") {
    const nested = message as { message?: unknown; error?: unknown };
    if (nested.message !== undefined) {
      return normalizeApiMessage(nested.message, fallback);
    }
    if (typeof nested.error === "string" && nested.error.trim()) {
      return nested.error;
    }
  }
  return fallback;
}

export function unwrapEnvelope<T>(body: unknown, status: number): T {
  const envelope = isEnvelope(body) ? body : null;
  const message = normalizeApiMessage(envelope?.message, "Request failed");
  if (
    status === 400 ||
    status === 401 ||
    status === 403 ||
    status === 409 ||
    status === 422 ||
    !envelope ||
    envelope.success !== true
  ) {
    throw new ApiError(status, message);
  }
  return envelope.data as T;
}

export function unwrapPage<T>(body: unknown, status: number): Page<T> {
  return unwrapEnvelope<Page<T>>(body, status);
}

export function pageQuery(page = 1, perPage = 10) {
  return { page, perPage };
}
