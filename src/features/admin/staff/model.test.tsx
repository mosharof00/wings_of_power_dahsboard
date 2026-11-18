import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { StatusBadge } from "@/components/feedback/status-badge";
import { UserManagementTabs } from "./user-tabs";
import {
  invitePayload,
  inviteSchema,
  staffPatch,
  staffRoleLabel,
  staffStatusVariant,
} from "./model";

describe("staff role label", () => {
  it("labels a teacher with Safe Space access as Counselor", () => {
    expect(staffRoleLabel({ role: "TEACHER", canAccessSafeSpace: true })).toBe(
      "Counselor",
    );
  });

  it("labels a teacher without Safe Space access as Teacher", () => {
    expect(staffRoleLabel({ role: "TEACHER", canAccessSafeSpace: false })).toBe(
      "Teacher",
    );
  });
});

describe("staff status", () => {
  it("uses the destructive inactive badge", () => {
    expect(staffStatusVariant("INACTIVE")).toBe("inactive");
    const html = renderToStaticMarkup(<StatusBadge variant="inactive" />);
    expect(html).toContain("Inactive");
    expect(html).toContain("text-destructive");
  });

  it("maps an invite to Invitation sent", () => {
    expect(staffStatusVariant("INVITED")).toBe("invitation");
  });
});

describe("staff payloads", () => {
  it("invites with name, email, temp password, and Safe Space permission", () => {
    expect(
      invitePayload({
        name: "Maya Chen",
        email: "maya@school.org",
        temporaryPassword: "TempPass1!",
        canAccessSafeSpace: true,
        assignedClass: "class-1",
      }),
    ).toEqual({
      name: "Maya Chen",
      email: "maya@school.org",
      temporaryPassword: "TempPass1!",
      canAccessSafeSpace: true,
      assignedClass: "class-1",
    });
  });

  it("requires a work email and temp password before inviting", () => {
    const result = inviteSchema.safeParse({
      name: "Maya Chen",
      email: "",
      assignedClass: "",
      temporaryPassword: "short",
      canAccessSafeSpace: false,
    });
    expect(result.success).toBe(false);
    if (result.success) return;
    const messages = result.error.issues.map((issue) => issue.message);
    expect(messages).toContain("Work email is required");
    expect(messages).toContain(
      "Temporary password must be at least 8 characters",
    );
  });

  it("saves the profile fields from the edit dialog", () => {
    expect(
      staffPatch({
        name: "Jonah Levy",
        email: "jonah@school.org",
        canAccessSafeSpace: true,
        assignedClass: "Grade 4 · Amber",
      }),
    ).toEqual({
      name: "Jonah Levy",
      email: "jonah@school.org",
      canAccessSafeSpace: true,
      assignedClass: "Grade 4 · Amber",
    });
  });
});

describe("user management tabs", () => {
  it("links Students and Pending Approvals", () => {
    const html = renderToStaticMarkup(<UserManagementTabs current="staff" />);
    expect(html).toContain('href="/admin/users/students"');
    expect(html).toContain('href="/admin/users/pending"');
    expect(html).toContain('href="/admin/users/staff"');
  });
});
