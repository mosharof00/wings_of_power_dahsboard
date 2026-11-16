import { api, callApi } from "@/lib/api/client";
import type { Envelope } from "@/lib/api/envelope";
import {
  normalizeStudentDetail,
  normalizeStudentList,
  type StudentListQuery,
  type StudentStatus,
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
  PATCH: (path: string, init?: { body?: unknown }) => Callish<never>;
};

function asCall<T>(value: Callish<never>) {
  return value as unknown as Callish<T>;
}

function client() {
  return api as unknown as LooseClient;
}

export async function getStudents(query: StudentListQuery) {
  const data = await callApi<unknown>(() =>
    asCall(client().GET("/admin/students", { params: { query } })),
  );
  return normalizeStudentList(data as Parameters<typeof normalizeStudentList>[0]);
}

export async function getStudent(id: string) {
  const data = await callApi<unknown>(() =>
    asCall(client().GET(`/admin/students/${id}`)),
  );
  return normalizeStudentDetail(data as Parameters<typeof normalizeStudentDetail>[0]);
}

export async function updateStudentStatus(id: string, status: StudentStatus) {
  await callApi<unknown>(() =>
    asCall(client().PATCH(`/admin/students/${id}`, { body: { status } })),
  );
  return getStudent(id);
}

export async function approveStudent(id: string) {
  await callApi<unknown>(() =>
    asCall(client().POST(`/admin/students/${id}/approve`)),
  );
  return getStudent(id);
}

export async function moveStudent(id: string, classId: string) {
  await callApi<unknown>(() =>
    asCall(client().POST(`/admin/students/${id}/move-class`, { body: { classId } })),
  );
  return getStudent(id);
}
