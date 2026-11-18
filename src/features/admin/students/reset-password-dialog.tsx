"use client";

import { useState } from "react";
import { toast } from "sonner";
import { DialogActions } from "@/components/feedback/dialog-actions";
import { toastSuccess } from "@/components/feedback/toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ApiError } from "@/lib/api/envelope";
import { resetStudentPassword } from "./api";

export function ResetStudentPasswordDialog({
  studentId,
  studentName,
  open,
  onOpenChange,
}: {
  studentId: string;
  studentName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [temporaryPassword, setTemporaryPassword] = useState("");
  const [resultPassword, setResultPassword] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const data = await resetStudentPassword(
        studentId,
        temporaryPassword.trim() || undefined,
      );
      setResultPassword(data.temporaryPassword);
      toastSuccess({
        title: "Password ready",
        description: `Tell ${studentName} this temporary password in person.`,
      });
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : "Could not reset the password.";
      setError(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setTemporaryPassword("");
          setResultPassword(null);
          setError("");
        }
        onOpenChange(next);
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reset password for {studentName}</DialogTitle>
        </DialogHeader>
        {resultPassword ? (
          <div className="grid gap-4">
            <p className="text-sm text-muted-foreground">
              Share this temporary password with the student. They can change it
              later in the app profile.
            </p>
            <p className="rounded-lg border bg-muted/40 px-3 py-2 font-mono text-sm">
              {resultPassword}
            </p>
            <DialogFooter className="flex-row justify-end border-0 bg-transparent p-0">
              <Button type="button" onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </DialogFooter>
          </div>
        ) : (
          <form className="grid gap-4" onSubmit={(e) => void onSubmit(e)}>
            <div className="grid gap-2">
              <Label htmlFor="temp-pass">Temporary password (optional)</Label>
              <Input
                id="temp-pass"
                type="text"
                value={temporaryPassword}
                onChange={(event) => setTemporaryPassword(event.target.value)}
                placeholder="Leave blank to auto-generate"
                autoComplete="off"
              />
              <p className="text-xs text-muted-foreground">
                Students do not have email reset. You tell them the password.
              </p>
            </div>
            {error ? (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            ) : null}
            <DialogActions
              onCancel={() => onOpenChange(false)}
              actionLabel="Reset password"
              pending={pending}
            />
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
