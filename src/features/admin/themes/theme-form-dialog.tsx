"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DialogActions } from "@/components/feedback/dialog-actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileUploadDropzone } from "@/features/admin/stories/file-upload-dropzone";
import { ApiError, normalizeApiMessage } from "@/lib/api/envelope";
import { createTheme, updateTheme } from "./api";
import {
  buildCreateThemePayload,
  buildUpdateThemePayload,
  createThemeSchema,
  type StoryTheme,
} from "./model";

export function ThemeFormDialog({
  open,
  onOpenChange,
  theme,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  theme?: StoryTheme | null;
  onSaved: (value: StoryTheme, mode: "create" | "edit") => void;
}) {
  const isEdit = Boolean(theme);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sortOrder, setSortOrder] = useState<number | string>(100);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [rootError, setRootError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setName(theme?.name ?? "");
    setSlug(theme?.slug ?? "");
    setSortOrder(theme?.sortOrder ?? 100);
    setCoverUrl(theme?.coverUrl ?? null);
    setRootError(null);
  }, [open, theme]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setRootError(null);

    const parseResult = createThemeSchema.safeParse({
      name,
      slug: slug.trim() || undefined,
      coverUrl,
      sortOrder:
        sortOrder === "" ? 100 : Number(sortOrder),
    });

    if (!parseResult.success) {
      const message =
        parseResult.error.issues[0]?.message ?? "Invalid theme details.";
      setRootError(message);
      toast.error(message);
      return;
    }

    setSaving(true);
    try {
      const saved =
        isEdit && theme
          ? await updateTheme(
              theme.id,
              buildUpdateThemePayload(parseResult.data),
            )
          : await createTheme(buildCreateThemePayload(parseResult.data));

      if (!saved?.id) {
        throw new ApiError(500, "Theme saved but response was empty.");
      }

      onSaved(saved, isEdit ? "edit" : "create");
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? normalizeApiMessage(error.message, "Could not save this theme.")
          : "Could not save this theme.";
      setRootError(message);
      toast.error(message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setRootError(null);
        onOpenChange(next);
      }}
    >
      <DialogContent className="flex max-h-[min(90vh,40rem)] w-full max-w-lg flex-col gap-0 overflow-hidden p-0 sm:max-w-lg">
        <DialogHeader className="shrink-0 px-4 pt-4 pr-12 pb-2">
          <DialogTitle>{isEdit ? "Edit Theme" : "Add Theme"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={onSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="min-h-0 flex-1 space-y-4 overflow-x-hidden overflow-y-auto px-4 py-2">
            {rootError ? (
              <p className="text-sm text-destructive" role="alert">
                {rootError}
              </p>
            ) : null}

            <div className="space-y-1.5">
              <Label htmlFor="theme-name">Name</Label>
              <Input
                id="theme-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Kindness"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="theme-slug">Slug (optional)</Label>
              <Input
                id="theme-slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="kindness"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="theme-sort">Sort order</Label>
              <Input
                id="theme-sort"
                type="number"
                min={0}
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
            </div>

            <div className="min-w-0 space-y-1.5">
              <Label>Cover</Label>
              <FileUploadDropzone
                purpose="THEME_COVER"
                currentUrl={coverUrl}
                onUploaded={(url) => setCoverUrl(url)}
                onClear={() => setCoverUrl(null)}
                label="Upload theme cover"
              />
            </div>
          </div>

          {/* Same popover surface as the card — no separate grey strip outside. */}
          <div className="shrink-0 px-4 pt-2 pb-4">
            <DialogActions
              actionLabel={isEdit ? "Save changes" : "Create theme"}
              pending={saving}
              onCancel={() => onOpenChange(false)}
            />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
