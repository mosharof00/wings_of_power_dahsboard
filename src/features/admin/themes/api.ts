import { apiBaseUrl } from "@/lib/api/client";
import { ApiError, unwrapEnvelope, type Envelope } from "@/lib/api/envelope";
import { readAccessToken } from "@/lib/auth/storage";
import type { StoryTheme } from "./model";

async function themesFetch<T>(
  path: string,
  init?: { method?: string; body?: unknown },
): Promise<T> {
  const headers = new Headers({ Accept: "application/json" });
  const token = readAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let body: BodyInit | undefined;
  if (init?.body !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(init.body);
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    method: init?.method ?? "GET",
    headers,
    body,
  });

  const json = (await response.json().catch(() => null)) as Envelope<T> | null;
  try {
    return unwrapEnvelope<T>(json, response.status);
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      response.status,
      "Could not complete theme request.",
    );
  }
}

export function getAdminThemes() {
  return themesFetch<StoryTheme[]>("/admin/themes");
}

export function getActiveThemes() {
  return themesFetch<StoryTheme[]>("/themes");
}

export function createTheme(body: {
  name: string;
  slug?: string;
  coverUrl?: string;
  sortOrder?: number;
}) {
  return themesFetch<StoryTheme>("/admin/themes", {
    method: "POST",
    body,
  });
}

export function updateTheme(
  id: string,
  body: {
    name?: string;
    slug?: string;
    coverUrl?: string | null;
    sortOrder?: number;
    isActive?: boolean;
  },
) {
  return themesFetch<StoryTheme>(`/admin/themes/${id}`, {
    method: "PATCH",
    body,
  });
}

export function deactivateTheme(id: string) {
  return themesFetch<StoryTheme>(`/admin/themes/${id}`, {
    method: "DELETE",
  });
}
