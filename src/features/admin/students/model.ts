import type { Page } from "@/lib/api/envelope";
import type { StatusBadgeVariant } from "@/components/feedback/status-badge";

export const STUDENT_PER_PAGE = 12;

export type StudentStatus = "ACTIVE" | "PENDING" | "INACTIVE";

export type ClassOption = {
  id: string;
  name: string;
};

export type StudentRow = {
  id: string;
  name: string;
  handle: string;
  studentCode: string;
  classId: string;
  className: string;
  positivePoints: number;
  progressPercent: number;
  reportCount: number;
  status: StudentStatus;
};

export type StudentList = Page<StudentRow> & {
  classOptions: ClassOption[];
};

export type QuizStatus = "COMPLETED" | "REMAINING" | "WAITING";

export type StoryProgress = {
  story: string;
  chapters: string;
  completed: number;
  total: number;
  score: string | null;
  quizStatus: QuizStatus;
  quizScore: string | null;
};

export type StudentDetail = StudentRow & {
  ageLabel: string;
  powerHeroesUnlocked: number;
  powerHeroesTotal: number;
  chaptersCompleted: number;
  progress: StoryProgress[];
  kindnessPoints: number;
  badgeCount: number;
  storyPoints: { story: string; points: number }[];
  history: { title: string; at: string; detail: string; amount: number }[];
  categories: { label: string; points: number }[];
  badges: { name: string; earned: boolean }[];
  classAchievement: {
    className: string;
    status: StudentStatus;
    completedChapters: number;
    completedChapterTotal: number;
    positivePoints: number;
    kindnessPoints: number;
  };
  eligibility: {
    storiesCompleted: number;
    storiesTotal: number;
    chaptersCompleted: number;
    chaptersTotal: number;
    scorePercent: number;
    scoreRequired: number;
    defenseResponse: string;
    defenseKindness: string;
  };
  safeSpace: {
    reportCount: number;
    newCount: number;
    reviewingCount: number;
    addressedCount: number;
  };
  classOptions: ClassOption[];
};

export type StudentListQuery = {
  page: number;
  perPage: number;
  q?: string;
  classId?: string;
  status?: StudentStatus;
};

export function studentListQuery(input: {
  page: number;
  q?: string;
  classId?: string;
  pending?: boolean;
}): StudentListQuery {
  return {
    page: input.page,
    perPage: STUDENT_PER_PAGE,
    q: input.q || undefined,
    classId: input.classId || undefined,
    status: input.pending ? "PENDING" : undefined,
  };
}

export function studentStatusVariant(status: StudentStatus): StatusBadgeVariant {
  if (status === "INACTIVE") return "inactive";
  if (status === "PENDING") return "pending";
  return "active";
}

export function powerHeroesValue(unlocked: number) {
  return unlocked > 0 ? "Available" : "N/A";
}

export function powerHeroesCount(unlocked: number, total: number) {
  return `${unlocked}/${total}`;
}

export function scoreLabel(value: string | null) {
  return value ?? "—";
}

export function badgeCountLabel(count: number) {
  return String(count).padStart(2, "0");
}

export function moveClassPayload(classId: string) {
  return { classId };
}

export function statusPatch(status: "ACTIVE" | "INACTIVE") {
  return { status };
}

export function quizStatusLabel(status: QuizStatus) {
  if (status === "COMPLETED") return "Completed";
  if (status === "REMAINING") return "Remaining";
  return "Waiting";
}

type ApiClass = { id?: string; name?: string } | null;

type ApiStudentListItem = {
  id?: string;
  name?: string | null;
  handle?: string | null;
  username?: string | null;
  nickname?: string | null;
  realName?: string | null;
  avatarUrl?: string | null;
  studentCode?: string | null;
  classId?: string | null;
  className?: string | null;
  class?: ApiClass;
  positivePoints?: number | null;
  progressPercent?: number | null;
  reportCount?: number | null;
  status?: string | null;
};

type ApiStudentDetail = ApiStudentListItem & {
  ageLabel?: string | null;
  user?: {
    id?: string;
    username?: string | null;
    nickname?: string | null;
    realName?: string | null;
    ageLabel?: string | null;
    status?: string | null;
    avatarUrl?: string | null;
  };
  membership?: {
    id?: string;
    classId?: string | null;
    className?: string | null;
    status?: string | null;
  } | null;
  powerHeroesUnlocked?: number;
  powerHeroesTotal?: number;
  chaptersCompleted?: number;
  progress?: StoryProgress[];
  kindnessPoints?: number;
  badgeCount?: number;
  storyPoints?: StudentDetail["storyPoints"];
  history?: StudentDetail["history"];
  categories?: StudentDetail["categories"];
  badges?: StudentDetail["badges"];
  classAchievement?: StudentDetail["classAchievement"];
  eligibility?: StudentDetail["eligibility"];
  safeSpace?: StudentDetail["safeSpace"];
  classOptions?: ClassOption[];
  reports?: unknown[];
  points?: unknown[];
};

function asStatus(value: string | null | undefined): StudentStatus {
  if (value === "PENDING" || value === "INACTIVE") return value;
  return "ACTIVE";
}

function displayName(row: {
  name?: string | null;
  realName?: string | null;
  nickname?: string | null;
  username?: string | null;
  handle?: string | null;
}) {
  return (
    row.name?.trim() ||
    row.realName?.trim() ||
    row.nickname?.trim() ||
    row.username?.trim() ||
    row.handle?.trim() ||
    "Student"
  );
}

function displayHandle(row: {
  handle?: string | null;
  username?: string | null;
  nickname?: string | null;
}) {
  return row.handle?.trim() || row.username?.trim() || row.nickname?.trim() || "—";
}

export function normalizeStudentRow(
  raw: ApiStudentListItem & { reports?: unknown[] },
): StudentRow {
  const id = raw.id ?? "";
  const classId = raw.classId ?? raw.class?.id ?? "";
  const className = raw.className ?? raw.class?.name ?? "—";
  return {
    id,
    name: displayName(raw),
    handle: displayHandle(raw),
    studentCode: raw.studentCode?.trim() || id.slice(0, 8).toUpperCase() || "—",
    classId,
    className,
    positivePoints: raw.positivePoints ?? 0,
    progressPercent: raw.progressPercent ?? 0,
    reportCount:
      raw.reportCount ?? (Array.isArray(raw.reports) ? raw.reports.length : 0),
    status: asStatus(raw.status),
  };
}

export function normalizeStudentList(raw: {
  items?: ApiStudentListItem[];
  total?: number;
  page?: number;
  perPage?: number;
  lastPage?: number;
  classOptions?: ClassOption[];
}): StudentList {
  const items = (raw.items ?? []).map(normalizeStudentRow);
  const classOptions =
    raw.classOptions ??
    Array.from(
      new Map(
        items
          .filter((item) => item.classId)
          .map((item) => [item.classId, { id: item.classId, name: item.className }]),
      ).values(),
    );
  return {
    items,
    total: raw.total ?? items.length,
    page: raw.page ?? 1,
    perPage: raw.perPage ?? STUDENT_PER_PAGE,
    lastPage: raw.lastPage ?? 1,
    classOptions,
  };
}

export function normalizeStudentDetail(raw: ApiStudentDetail): StudentDetail {
  const user = raw.user;
  const membership = raw.membership;
  const base = normalizeStudentRow({
    id: raw.id ?? user?.id,
    name: raw.name,
    realName: raw.realName ?? user?.realName,
    nickname: raw.nickname ?? user?.nickname,
    username: raw.username ?? user?.username,
    handle: raw.handle,
    studentCode: raw.studentCode,
    classId: raw.classId ?? membership?.classId ?? raw.class?.id,
    className: raw.className ?? membership?.className ?? raw.class?.name,
    class: raw.class,
    positivePoints: raw.positivePoints,
    progressPercent: raw.progressPercent,
    reportCount: raw.reportCount,
    status: raw.status ?? user?.status,
    reports: raw.reports,
  });
  const className = base.className === "—" ? "Unassigned" : base.className;
  return {
    ...base,
    ageLabel: raw.ageLabel ?? user?.ageLabel ?? "—",
    powerHeroesUnlocked: raw.powerHeroesUnlocked ?? 0,
    powerHeroesTotal: raw.powerHeroesTotal ?? 8,
    chaptersCompleted: raw.chaptersCompleted ?? 0,
    progress: raw.progress ?? [],
    kindnessPoints: raw.kindnessPoints ?? 0,
    badgeCount: raw.badgeCount ?? 0,
    storyPoints: raw.storyPoints ?? [],
    history: raw.history ?? [],
    categories: raw.categories ?? [],
    badges: raw.badges ?? [],
    classAchievement: raw.classAchievement ?? {
      className,
      status: base.status,
      completedChapters: 0,
      completedChapterTotal: 0,
      positivePoints: 0,
      kindnessPoints: 0,
    },
    eligibility: raw.eligibility ?? {
      storiesCompleted: 0,
      storiesTotal: 2,
      chaptersCompleted: 0,
      chaptersTotal: 6,
      scorePercent: 0,
      scoreRequired: 70,
      defenseResponse: "No response recorded",
      defenseKindness: "Not available",
    },
    safeSpace: raw.safeSpace ?? {
      reportCount: Array.isArray(raw.reports) ? raw.reports.length : 0,
      newCount: 0,
      reviewingCount: 0,
      addressedCount: 0,
    },
    classOptions: raw.classOptions ?? [],
  };
}
