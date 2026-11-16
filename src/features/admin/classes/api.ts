import { api, callApi } from "@/lib/api/client";
import type { Envelope } from "@/lib/api/envelope";
import {
  normalizeClassDetail,
  normalizeClassList,
  normalizeClassRequestLists,
  normalizeIssuedCode,
  type ClassDetail,
} from "./model";

type Callish<T> = Promise<{
  data?: Envelope<T>;
  error?: Envelope<T>;
  response: Response;
}>;

type LooseClient = {
  GET: (
    path: string,
    init?: { params?: { query?: Record<string, string | number | undefined> } },
  ) => Callish<never>;
  POST: (path: string, init?: { body?: unknown }) => Callish<never>;
};

function asCall<T>(value: Callish<never>) {
  return value as unknown as Callish<T>;
}

function client() {
  return api as unknown as LooseClient;
}

export async function getClasses(query: {
  page: number;
  perPage: number;
  q?: string;
}) {
  const data = await callApi<unknown>(() =>
    asCall(client().GET("/admin/classes", { params: { query } })),
  );
  return normalizeClassList(data as Parameters<typeof normalizeClassList>[0]);
}

export async function getClass(id: string) {
  const data = await callApi<unknown>(() =>
    asCall(client().GET(`/admin/classes/${id}`)),
  );
  return normalizeClassDetail(data as Parameters<typeof normalizeClassDetail>[0]);
}

export async function createClass(body: {
  name: string;
  grade: string;
  ageGroup: string;
  teacherId: string;
}) {
  const data = await callApi<unknown>(() =>
    asCall(client().POST("/admin/classes", { body })),
  );
  return normalizeClassDetail(data as Parameters<typeof normalizeClassDetail>[0]);
}

export async function changeTeacher(id: string, teacherId: string) {
  await callApi<unknown>(() =>
    asCall(client().POST(`/admin/classes/${id}/change-teacher`, { body: { teacherId } })),
  );
  return getClass(id);
}

export async function regenerateCode(id: string) {
  const data = await callApi<{ className?: string; code?: string; classId?: string }>(() =>
    asCall(client().POST(`/admin/classes/${id}/codes`)),
  );
  return normalizeIssuedCode(data);
}

export async function getClassRequests() {
  const data = await callApi<unknown>(() =>
    asCall(client().GET("/admin/class-requests")),
  );
  return normalizeClassRequestLists(
    data as Parameters<typeof normalizeClassRequestLists>[0],
  );
}

export async function approveClassRequest(id: string) {
  const data = await callApi<{
    className?: string;
    code?: string;
    resultingClassId?: string;
  }>(() => asCall(client().POST(`/admin/class-requests/${id}/approve`)));
  if (data?.code) return normalizeIssuedCode(data);
  if (data?.resultingClassId) {
    const detail = await getClass(data.resultingClassId);
    return { className: detail.name, code: detail.code };
  }
  return normalizeIssuedCode(data);
}

export async function rejectClassRequest(id: string) {
  return callApi(() => client().POST(`/admin/class-requests/${id}/reject`));
}

export async function approveRenewal(id: string) {
  const data = await callApi<{ className?: string; code?: string }>(() =>
    asCall(client().POST(`/admin/code-renewals/${id}/approve`)),
  );
  return normalizeIssuedCode(data);
}

export type { ClassDetail };
