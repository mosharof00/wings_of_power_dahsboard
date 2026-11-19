"use client"

import { cn } from "cn"
import { Button } from "@/components/ui/button"
import { DialogFooter } from "@/components/ui/dialog"

export function DialogActions({
  onCancel,
  cancelLabel = "Cancel",
  actionLabel,
  pending = false,
  className,
}: {
  onCancel: () => void
  cancelLabel?: string
  actionLabel: string
  pending?: boolean
  className?: string
}) {
  return (
    <DialogFooter
      className={cn(
        // Override DialogFooter bleed (-mx-4 -mb-4) so actions stay inside the card.
        "mx-0 mb-0 flex-row justify-end border-0 bg-transparent p-0",
        className,
      )}
    >
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        disabled={pending}
      >
        {cancelLabel}
      </Button>
      <Button type="submit" disabled={pending}>
        {actionLabel}
      </Button>
    </DialogFooter>
  )
}
