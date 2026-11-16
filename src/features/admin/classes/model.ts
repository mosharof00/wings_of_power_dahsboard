import { z } from "zod";
import type { Page } from "@/lib/api/envelope";
import type { StatusBadgeVariant } from "@/components/feedback/status-badge";

export const CLASS_PER_PAGE = 15;
export const CLASS_SUBTITLE = "Manage classes, join codes, and teacher assignment.";

export const AGE_GROUPS = [
  { value: "6-9", label: "6–9", apiValue: "AGE_6_9" },
  { value: "10-13", label: "10–13", apiValue: "AGE_10_13" },
  { value: "adults", label: "Adults", apiValue: "ADULTS" },
] as const;

export type ClassStatus = "ACTIVE" | "INACTIVE";

export type SchoolClass = {
  id: string;
  name: string;
  grade: string;
  ageGroup: string;
  code: string;
  codeExpired: boolean;
  teacherName: string;
  studentCount: number;
  status: ClassStatus;
  createdAt: string;
};

export type ClassList = Page<SchoolClass> & {
  pendingRequestCount: number;
};

export type ClassStudent = {
  id: string;
  name: string;
  handle: string;
  studentCode: string;
  className: string;
  positivePoints: number;
  progressPercent: number;
  reportCount: number;
  status: "ACTIVE" | "PENDING" | "INACTIVE";
};

export type ClassDetail = SchoolClass & {
  readingProgressPercent: number;
  quizScorePercent: number;
  createdBy: string;
  teacher: { id: string; name: string; handle: string; staffCode: string };
  students: ClassStudent[];
};

export type ClassRequest = {
  id: string;
  teacherName: string;
  teacherHandle: string;
  requestedAt: string;
  className: string;
  grade: string;
  ageGroup: string;
  status: "PENDING";
};

export type CodeRenewal = {
  id: string;
  requestCode: string;
  teacherName: string;
  teacherHandle: string;
  classId: string;
  className: string;
  studentCount: number;
  requestedAt: string;
  codeStatus: "EXPIRED";
  reason: string;
};

export type ClassRequestLists = {
  classCount: number;
  requests: ClassRequest[];
  renewals: CodeRenewal[];
};

export type IssuedCode = {
  className: string;
  code: string;
};

const ageValues = AGE_GROUPS.map((item) => item.value) as ["6-9", "10-13", "adults"];

export const createClassSchema = z.object({
  name: z.string().trim().min(1, "Class name is required"),
  grade: z.string().trim().min(1, "Grade is required"),
  ageGroup: z.enum(ageValues, { error: "Choose an age group" }),
  teacherId: z.string().min(1, "Choose a teacher"),
});

export type CreateClassValues = z.infer<typeof createClassSchema>;

export function classListQuery(input: { page: number; q?: string }) {
  return {
    page: input.page,
    perPage: CLASS_PER_PAGE,
    q: input.q || undefined,
  };
}

export function createClassPayload(values: CreateClassValues) {
  const age = AGE_GROUPS.find((group) => group.value === values.ageGroup);
  return {
    name: values.name.trim(),
    grade: values.grade.trim(),
    ageGroup: age?.apiValue ?? values.ageGroup,
    teacherId: values.teacherId,
  };
}

export function ageGroupLabel(value: string | null | undefined) {
  if (!value) return "—";
  const match = AGE_GROUPS.find(
    (group) => group.value === value || group.apiValue === value,
  );
  return match?.label ?? value.replace(/^AGE_/, "").replace(/_/g, "-");
}

type ApiClassRow = {
  id?: string;
  name?: string | null;
  grade?: string | null;
  gradeLabel?: string | null;
  ageGroup?: string | null;
  code?: string | null;
  codeExpired?: boolean;
  teacherName?: string | null;
  studentCount?: number | null;
  status?: string | null;
  createdAt?: string | null;
  activeCode?: { id?: string; code?: string | null; expiresAt?: string | null } | null;
  membershipCounts?: {
    pending?: number;
    approved?: number;
    rejected?: number;
  } | null;
  teacher?: {
    id?: string;
    name?: string | null;
    handle?: string | null;
    staffCode?: string | null;
  } | null;
  students?: ClassStudent[] | null;
  readingProgressPercent?: number | null;
  quizScorePercent?: number | null;
  createdBy?: string | null;
};

type ApiRequestItem = {
  type?: string;
  id?: string;
  status?: string;
  createdAt?: string | Date;
  payload?: {
    name?: string;
    grade?: string;
    age_group?: string;
    ageGroup?: string;
    teacherName?: string;
    teacherHandle?: string;
  } | null;
  classId?: string | null;
  className?: string | null;
  reason?: string | null;
  teacherName?: string | null;
  teacherHandle?: string | null;
  requestCode?: string | null;
  studentCount?: number | null;
  codeStatus?: string | null;
  requestedAt?: string | null;
};

export function normalizeSchoolClass(raw: ApiClassRow): SchoolClass {
  const code = raw.code ?? raw.activeCode?.code ?? "—";
  const expired =
    raw.codeExpired ??
    (raw.activeCode?.expiresAt
      ? new Date(raw.activeCode.expiresAt).getTime() < Date.now()
      : false);
  return {
    id: raw.id ?? "",
    name: raw.name?.trim() || "Untitled class",
    grade: raw.grade ?? raw.gradeLabel ?? "—",
    ageGroup: ageGroupLabel(raw.ageGroup),
    code,
    codeExpired: Boolean(expired),
    teacherName: raw.teacherName ?? raw.teacher?.name ?? "—",
    studentCount:
      raw.studentCount ??
      raw.membershipCounts?.approved ??
      0,
    status: raw.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    createdAt: raw.createdAt ?? "—",
  };
}

export function normalizeClassList(raw: {
  items?: ApiClassRow[];
  total?: number;
  page?: number;
  perPage?: number;
  lastPage?: number;
  pendingRequestCount?: number;
}): ClassList {
  const items = (raw.items ?? []).map(normalizeSchoolClass);
  return {
    items,
    total: raw.total ?? items.length,
    page: raw.page ?? 1,
    perPage: raw.perPage ?? CLASS_PER_PAGE,
    lastPage: raw.lastPage ?? 1,
    pendingRequestCount: raw.pendingRequestCount ?? 0,
  };
}

export function normalizeClassDetail(raw: ApiClassRow): ClassDetail {
  const base = normalizeSchoolClass(raw);
  return {
    ...base,
    readingProgressPercent: raw.readingProgressPercent ?? 0,
    quizScorePercent: raw.quizScorePercent ?? 0,
    createdBy: raw.createdBy ?? "Admin",
    teacher: {
      id: raw.teacher?.id ?? "",
      name: raw.teacher?.name ?? base.teacherName,
      handle: raw.teacher?.handle ?? "—",
      staffCode: raw.teacher?.staffCode ?? "—",
    },
    students: raw.students ?? [],
  };
}

function requestDate(value: string | Date | null | undefined) {
  if (!value) return "—";
  if (typeof value === "string") return value;
  return value.toISOString();
}

export function normalizeClassRequestLists(raw: {
  classCount?: number;
  requests?: ClassRequest[];
  renewals?: CodeRenewal[];
  items?: ApiRequestItem[];
  total?: number;
}): ClassRequestLists {
  if (Array.isArray(raw.requests) || Array.isArray(raw.renewals)) {
    return {
      classCount: raw.classCount ?? 0,
      requests: raw.requests ?? [],
      renewals: raw.renewals ?? [],
    };
  }
  const items = raw.items ?? [];
  const requests: ClassRequest[] = [];
  const renewals: CodeRenewal[] = [];
  for (const item of items) {
    if (item.type === "RENEWAL") {
      renewals.push({
        id: item.id ?? "",
        requestCode: item.requestCode ?? item.id ?? "—",
        teacherName: item.teacherName ?? "Teacher",
        teacherHandle: item.teacherHandle ?? "—",
        classId: item.classId ?? "",
        className: item.className ?? "—",
        studentCount: item.studentCount ?? 0,
        requestedAt: item.requestedAt ?? requestDate(item.createdAt),
        codeStatus: "EXPIRED",
        reason: item.reason ?? "Code Expired",
      });
      continue;
    }
    const payload = item.payload ?? {};
    requests.push({
      id: item.id ?? "",
      teacherName: item.teacherName ?? payload.teacherName ?? "Teacher",
      teacherHandle: item.teacherHandle ?? payload.teacherHandle ?? "—",
      requestedAt: item.requestedAt ?? requestDate(item.createdAt),
      className: payload.name ?? item.className ?? "—",
      grade: payload.grade ?? "—",
      ageGroup: ageGroupLabel(payload.ageGroup ?? payload.age_group),
      status: "PENDING",
    });
  }
  return {
    classCount: raw.classCount ?? raw.total ?? items.length,
    requests,
    renewals,
  };
}

export function normalizeIssuedCode(
  raw: { className?: string; code?: string; classId?: string } | null | undefined,
  fallbackName = "",
) {
  return {
    className: raw?.className ?? fallbackName,
    code: raw?.code ?? "",
  };
}

export function teacherChoices<T extends { role: string; status: string }>(staff: T[]) {
  return staff.filter((member) => member.role === "TEACHER" && member.status === "ACTIVE");
}

export function classStatusVariant(status: ClassStatus): StatusBadgeVariant {
  return status === "ACTIVE" ? "active" : "inactive";
}

export function requestBanner(count: number) {
  const noun = count === 1 ? "request" : "requests";
  return `${count} class creation ${noun} waiting for approval`;
}

export function classReadyLine(name: string) {
  return `class [${name}] is ready.`;
}

export function changeTeacherPayload(teacherId: string) {
  return { teacherId };
}
