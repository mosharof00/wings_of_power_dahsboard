"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { applyApiFormError } from "@/components/feedback/apply-api-form-error";
import { DialogActions } from "@/components/feedback/dialog-actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FileUploadDropzone } from "@/features/admin/stories/file-upload-dropzone";
import { ApiError, normalizeApiMessage } from "@/lib/api/envelope";
import { createTheme, updateTheme } from "./api";
import {
  buildCreateThemePayload,
  buildUpdateThemePayload,
  createThemeSchema,
  type CreateThemeValues,
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
  onSaved: (value: StoryTheme) => void;
}) {
  const isEdit = Boolean(theme);
  const form = useForm<CreateThemeValues>({
    resolver: zodResolver(createThemeSchema),
    defaultValues: {
      name: "",
      slug: "",
      coverUrl: null,
      sortOrder: 100,
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      name: theme?.name ?? "",
      slug: theme?.slug ?? "",
      coverUrl: theme?.coverUrl ?? null,
      sortOrder: theme?.sortOrder ?? 100,
    });
  }, [open, theme, form]);

  async function onSubmit(values: CreateThemeValues) {
    try {
      const saved =
        isEdit && theme
          ? await updateTheme(theme.id, buildUpdateThemePayload(values))
          : await createTheme(buildCreateThemePayload(values));
      form.reset();
      onOpenChange(false);
      onSaved(saved);
    } catch (error) {
      const message =
        error instanceof ApiError
          ? normalizeApiMessage(error.message, "Could not save this theme.")
          : "Could not save this theme.";
      applyApiFormError(form, { message });
      toast.error(message);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) form.reset();
        onOpenChange(next);
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Theme" : "Add Theme"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            {form.formState.errors.root?.message ? (
              <p className="text-sm text-destructive" role="alert">
                {form.formState.errors.root.message}
              </p>
            ) : null}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g. Kindness" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="kindness" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sortOrder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      value={field.value ?? 100}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value === "" ? 100 : Number(e.target.value),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coverUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover</FormLabel>
                  <FormControl>
                    <FileUploadDropzone
                      purpose="THEME_COVER"
                      currentUrl={field.value}
                      onUploaded={(url) => field.onChange(url)}
                      onClear={() => field.onChange(null)}
                      label="Upload theme cover"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogActions
              actionLabel={isEdit ? "Save changes" : "Create theme"}
              pending={form.formState.isSubmitting}
              onCancel={() => onOpenChange(false)}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
