import { z } from "zod";

export const THEMES_SUBTITLE =
  "Manage book category themes shown on the student home screen.";

export type StoryTheme = {
  id: string;
  name: string;
  slug: string;
  coverUrl?: string | null;
  sortOrder: number;
  isActive: boolean;
  storyCount?: number;
  createdAt?: string;
  updatedAt?: string;
};

export const createThemeSchema = z.object({
  name: z.string().trim().min(1, "Theme name is required"),
  slug: z.string().trim().optional(),
  coverUrl: z.string().optional().nullable(),
  sortOrder: z.number().int().min(0).optional(),
});

export type CreateThemeValues = z.infer<typeof createThemeSchema>;

export const updateThemeSchema = createThemeSchema.extend({
  isActive: z.boolean().optional(),
});

export type UpdateThemeValues = z.infer<typeof updateThemeSchema>;

export function buildCreateThemePayload(values: CreateThemeValues) {
  return {
    name: values.name.trim(),
    slug: values.slug?.trim() || undefined,
    coverUrl: values.coverUrl || undefined,
    sortOrder: values.sortOrder ?? 100,
  };
}

export function buildUpdateThemePayload(values: UpdateThemeValues) {
  const payload: {
    name: string;
    slug?: string;
    coverUrl?: string | null;
    sortOrder?: number;
    isActive?: boolean;
  } = {
    name: values.name.trim(),
    slug: values.slug?.trim() || undefined,
    sortOrder: values.sortOrder ?? undefined,
  };
  // Always send coverUrl on edit so clearing cover persists (null).
  if (values.coverUrl !== undefined) {
    payload.coverUrl = values.coverUrl;
  }
  if (values.isActive !== undefined) {
    payload.isActive = values.isActive;
  }
  return payload;
}
