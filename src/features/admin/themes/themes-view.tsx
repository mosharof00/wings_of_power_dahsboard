"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Power } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { DataTable, type DataTableFeatures } from "@/components/data-table/data-table";
import { ErrorState, LoadingState } from "@/components/feedback/states";
import { StatusBadge } from "@/components/feedback/status-badge";
import { toastSuccess } from "@/components/feedback/toast";
import { Button } from "@/components/ui/button";
import { ApiError, normalizeApiMessage } from "@/lib/api/envelope";
import { deactivateTheme, getAdminThemes, updateTheme } from "./api";
import type { StoryTheme } from "./model";
import { THEMES_SUBTITLE } from "./model";
import { ThemeFormDialog } from "./theme-form-dialog";

const PER_PAGE = 15;

export function ThemesView() {
  const queryClient = useQueryClient();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<StoryTheme | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["admin-themes"],
    queryFn: getAdminThemes,
    retry: false,
  });

  const filtered = useMemo(() => {
    const rows = query.data ?? [];
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        row.slug.toLowerCase().includes(q),
    );
  }, [query.data, search]);

  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE));
  const safePage = Math.min(page, lastPage);
  const pageRows = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  const columns: ColumnDef<DataTableFeatures, StoryTheme>[] = [
    {
      id: "cover",
      header: "Cover",
      cell: ({ row }) =>
        row.original.coverUrl ? (
          <div className="relative h-16 w-12 overflow-hidden rounded">
            <Image
              src={row.original.coverUrl}
              alt=""
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex h-16 w-12 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
            —
          </div>
        ),
    },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "slug", header: "Slug" },
    {
      id: "stories",
      header: "Stories",
      cell: ({ row }) => row.original.storyCount ?? 0,
    },
    { accessorKey: "sortOrder", header: "Order" },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge
          variant={row.original.isActive ? "active" : "inactive"}
        />
      ),
    },
  ];

  async function toggleActive(theme: StoryTheme) {
    setBusyId(theme.id);
    try {
      if (theme.isActive) {
        await deactivateTheme(theme.id);
        toastSuccess({
          title: "Theme deactivated",
          description: `"${theme.name}" is hidden from pickers and home.`,
        });
      } else {
        await updateTheme(theme.id, { isActive: true });
        toastSuccess({
          title: "Theme activated",
          description: `"${theme.name}" is available again.`,
        });
      }
      await queryClient.invalidateQueries({ queryKey: ["admin-themes"] });
      await queryClient.invalidateQueries({ queryKey: ["active-themes"] });
    } catch (error) {
      toast.error(
        error instanceof ApiError
          ? normalizeApiMessage(error.message, "Could not update theme.")
          : "Could not update theme.",
      );
    } finally {
      setBusyId(null);
    }
  }

  if (query.isLoading) return <LoadingState kind="table" count={5} columns={6} />;
  if (query.isError) {
    return (
      <ErrorState
        message={
          query.error instanceof ApiError
            ? normalizeApiMessage(query.error.message, "Could not load themes.")
            : "Could not load themes."
        }
        onRetry={() => void query.refetch()}
      />
    );
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Themes</h2>
          <p className="text-sm text-muted-foreground">{THEMES_SUBTITLE}</p>
        </div>
        <Button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="size-4" />
          Add Theme
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={pageRows}
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        searchPlaceholder="Search themes"
        page={safePage}
        perPage={PER_PAGE}
        total={total}
        lastPage={lastPage}
        onPageChange={setPage}
        empty="No themes yet. Add Kindness, Courage, or any book category."
        getRowId={(row) => row.id}
        rowAction={(theme) => (
          <div className="flex justify-end gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              aria-label={`Edit ${theme.name}`}
              onClick={() => {
                setEditing(theme);
                setFormOpen(true);
              }}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              disabled={busyId === theme.id}
              aria-label={
                theme.isActive
                  ? `Deactivate ${theme.name}`
                  : `Activate ${theme.name}`
              }
              onClick={() => void toggleActive(theme)}
            >
              <Power className="size-4" />
            </Button>
          </div>
        )}
      />

      <ThemeFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open);
          if (!open) setEditing(null);
        }}
        theme={editing}
        onSaved={async (_saved, mode) => {
          toastSuccess({
            title: mode === "edit" ? "Theme updated" : "Theme created",
            description:
              mode === "edit"
                ? "Theme details were saved."
                : "Theme is ready to assign to stories.",
          });
          await queryClient.invalidateQueries({ queryKey: ["admin-themes"] });
          await queryClient.invalidateQueries({ queryKey: ["active-themes"] });
        }}
      />
    </div>
  );
}
