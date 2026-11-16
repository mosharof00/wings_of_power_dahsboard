import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "@/components/feedback/status-badge";
import {
  badgeCountLabel,
  moveClassPayload,
  normalizeStudentDetail,
  normalizeStudentList,
  powerHeroesValue,
  quizStatusLabel,
  scoreLabel,
  statusPatch,
  studentListQuery,
  studentStatusVariant,
} from "./model";
import { ProfilePanels, type ProfileTab } from "./profile-panels";
import type { StudentDetail } from "./model";

describe("student list query", () => {
  it("sends PENDING for the approvals tab and keeps class and search", () => {
    expect(
      studentListQuery({
        page: 2,
        q: "jonah",
        classId: "class-amber",
        pending: true,
      }),
    ).toEqual({
      page: 2,
      perPage: 12,
      q: "jonah",
      classId: "class-amber",
      status: "PENDING",
    });
  });

  it("omits status on the full student list", () => {
    expect(studentListQuery({ page: 1 }).status).toBeUndefined();
  });
});

describe("student status", () => {
  it("maps pending and inactive onto the shared badges", () => {
    expect(studentStatusVariant("PENDING")).toBe("pending");
    expect(studentStatusVariant("INACTIVE")).toBe("inactive");
    const html = renderToStaticMarkup(<StatusBadge variant="inactive" />);
    expect(html).toContain("Inactive");
    expect(html).toContain("text-destructive");
  });
});

describe("student payloads", () => {
  it("moves a student with classId only", () => {
    expect(moveClassPayload("class-ruby")).toEqual({ classId: "class-ruby" });
  });

  it("reactivates with ACTIVE", () => {
    expect(statusPatch("ACTIVE")).toEqual({ status: "ACTIVE" });
  });

  it("shows N/A when no power heroes are unlocked and an en dash for a missing score", () => {
    expect(powerHeroesValue(0)).toBe("N/A");
    expect(powerHeroesValue(2)).toBe("Available");
    expect(scoreLabel(null)).toBe("—");
    expect(badgeCountLabel(2)).toBe("02");
    expect(quizStatusLabel("WAITING")).toBe("Waiting");
  });

  it("maps the Nest list item onto dashboard columns", () => {
    const list = normalizeStudentList({
      items: [
        {
          id: "stu-1",
          username: "jonah41",
          nickname: "Jonah",
          realName: "Jonah Levy",
          status: "PENDING",
          avatarUrl: null,
          class: { id: "class-amber", name: "Grade 4 · Amber" },
        },
      ],
      total: 1,
      page: 1,
      perPage: 12,
      lastPage: 1,
    });
    expect(list.items[0]).toMatchObject({
      id: "stu-1",
      name: "Jonah Levy",
      handle: "jonah41",
      classId: "class-amber",
      className: "Grade 4 · Amber",
      positivePoints: 0,
      progressPercent: 0,
      reportCount: 0,
      status: "PENDING",
    });
  });

  it("maps nested detail user and membership", () => {
    const detail = normalizeStudentDetail({
      user: {
        id: "stu-1",
        username: "jonah41",
        nickname: "Jonah",
        realName: "Jonah Levy",
        ageLabel: "9 years",
        status: "ACTIVE",
      },
      membership: {
        id: "mem-1",
        classId: "class-amber",
        className: "Grade 4 · Amber",
        status: "APPROVED",
      },
      points: [],
      badges: [],
      progress: [],
      reports: [],
    });
    expect(detail.name).toBe("Jonah Levy");
    expect(detail.handle).toBe("jonah41");
    expect(detail.className).toBe("Grade 4 · Amber");
    expect(detail.ageLabel).toBe("9 years");
    expect(detail.progress).toEqual([]);
  });
});

const student: StudentDetail = {
  id: "1",
  name: "Jonah Levy",
  handle: "jonah41",
  studentCode: "84658",
  classId: "class-amber",
  className: "Grade 4 · Amber",
  positivePoints: 88,
  progressPercent: 68,
  reportCount: 1,
  status: "ACTIVE",
  ageLabel: "4 years",
  powerHeroesUnlocked: 2,
  powerHeroesTotal: 8,
  chaptersCompleted: 6,
  progress: [],
  kindnessPoints: 50,
  badgeCount: 2,
  storyPoints: [],
  history: [],
  categories: [],
  badges: [],
  classAchievement: {
    className: "Grade 4 · Amber",
    status: "ACTIVE",
    completedChapters: 6,
    completedChapterTotal: 10,
    positivePoints: 20,
    kindnessPoints: 15,
  },
  eligibility: {
    storiesCompleted: 1,
    storiesTotal: 2,
    chaptersCompleted: 4,
    chaptersTotal: 6,
    scorePercent: 40,
    scoreRequired: 70,
    defenseResponse: "No response recorded",
    defenseKindness: "Not available",
  },
  safeSpace: { reportCount: 1, newCount: 1, reviewingCount: 0, addressedCount: 0 },
  classOptions: [],
};

describe("student profile tabs", () => {
  it.each<[ProfileTab, string]>([
    ["details", "Personal Details"],
    ["progress", "Every chapter is a step forward"],
    ["points", "Kindness points"],
    ["eligibility", "Defense round"],
    ["safe-space", "Safe Space overview"],
  ])("renders the %s tab", (tab, heading) => {
    const html = renderToStaticMarkup(<ProfilePanels student={student} tab={tab} />);
    expect(html).toContain(heading);
  });

  it("keeps Safe Space to counts", () => {
    const html = renderToStaticMarkup(<ProfilePanels student={student} tab="safe-space" />);
    expect(html).toContain("No student messages or report content are shown");
    expect(html).toContain('href="/admin/safe-space"');
  });
});
