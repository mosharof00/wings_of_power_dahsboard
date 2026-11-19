"use client";

import { CheckCircle2, Loader2, Music, Upload, X, ZoomIn } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ApiError } from "@/lib/api/envelope";
import { uploadFile, type UploadPurpose } from "./api";

const IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp"];
const AUDIO_MIMES = ["audio/mpeg", "audio/mp4", "audio/aac"];

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_AUDIO_BYTES = 20 * 1024 * 1024;

export function FileUploadDropzone({
  purpose,
  currentUrl,
  onUploaded,
  onClear,
  label = "Upload File",
}: {
  purpose: UploadPurpose;
  currentUrl?: string | null;
  onUploaded: (url: string) => void;
  onClear?: () => void;
  label?: string;
}) {
  const isAudio = purpose === "CHAPTER_AUDIO";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removeOpen, setRemoveOpen] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const accept = isAudio ? ".mp3,.m4a,.aac,audio/*" : ".jpg,.jpeg,.png,.webp,image/*";
  const maxBytes = isAudio ? MAX_AUDIO_BYTES : MAX_IMAGE_BYTES;
  const hint = isAudio ? "MP3, M4A, AAC (Max 20MB)" : "JPG, PNG, WebP (Max 5MB)";

  async function handleFile(file: File) {
    const allowed = isAudio ? AUDIO_MIMES : IMAGE_MIMES;
    if (file.type && !allowed.includes(file.type)) {
      toast.error(`Invalid file type. Allowed: ${isAudio ? "MP3, M4A, AAC" : "JPG, PNG, WebP"}`);
      return;
    }
    if (file.size > maxBytes) {
      toast.error(`File is too large. Max size: ${isAudio ? "20MB" : "5MB"}`);
      return;
    }

    setUploading(true);
    try {
      const result = await uploadFile(file, purpose);
      onUploaded(result.url);
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Failed to upload file. Please try again.",
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleFile(file);
    }
  }

  function confirmRemove() {
    onClear?.();
    setRemoveOpen(false);
  }

  return (
    <div className="min-w-0 space-y-2 overflow-hidden">
      <span className="text-sm font-medium">{label}</span>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      {currentUrl ? (
        <div className="min-w-0 space-y-3 overflow-hidden rounded-xl border bg-muted/30 p-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex min-w-0 flex-1 items-start gap-3">
              {isAudio ? (
                <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Music className="size-6" />
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  className="group relative size-16 shrink-0 overflow-hidden rounded-lg border bg-background sm:size-20"
                  aria-label="View uploaded image"
                  title="Click to view image"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={currentUrl}
                    alt="Uploaded thumbnail"
                    className="size-full object-cover transition group-hover:opacity-90"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
                    <ZoomIn className="size-5" />
                  </span>
                </button>
              )}
              <div className="min-w-0 flex-1 space-y-1 overflow-hidden">
                <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <CheckCircle2 className="size-4 shrink-0 text-success" />
                  <span className="truncate">
                    {isAudio ? "Audio file uploaded" : "Image uploaded"}
                  </span>
                </div>
                <p
                  className="truncate text-xs text-muted-foreground"
                  title={currentUrl}
                >
                  {currentUrl.split("/").pop() || currentUrl}
                </p>
                {!isAudio ? (
                  <button
                    type="button"
                    className="text-xs font-medium text-primary hover:underline"
                    onClick={() => setLightboxOpen(true)}
                  >
                    View image
                  </button>
                ) : null}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                Change
              </Button>
              {onClear ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  disabled={uploading}
                  onClick={() => setRemoveOpen(true)}
                  aria-label="Remove uploaded file"
                >
                  <X className="size-4" />
                </Button>
              ) : null}
            </div>
          </div>

          {isAudio ? (
            <audio controls preload="metadata" className="w-full" src={currentUrl}>
              Your browser does not support audio playback.
            </audio>
          ) : null}
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed p-6 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-muted/40"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="size-8 animate-spin text-primary" />
              <p className="text-sm font-medium text-foreground">Uploading file...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                {isAudio ? <Music className="size-5" /> : <Upload className="size-5" />}
              </div>
              <p className="text-sm font-medium text-foreground">
                Drag &amp; Drop {isAudio ? "audio" : "image"} or{" "}
                <span className="text-primary underline">Browse</span>
              </p>
              <p className="text-xs text-muted-foreground">{hint}</p>
            </div>
          )}
        </div>
      )}

      {!isAudio && currentUrl ? (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={[{ src: currentUrl }]}
          plugins={[Zoom]}
          carousel={{ finite: true }}
          render={{ buttonPrev: () => null, buttonNext: () => null }}
          zoom={{ maxZoomPixelRatio: 4, scrollToZoom: true }}
        />
      ) : null}

      <Dialog open={removeOpen} onOpenChange={setRemoveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Remove {isAudio ? "audio" : "image"}?
            </DialogTitle>
            <DialogDescription>
              This clears the uploaded {isAudio ? "audio file" : "image"} from the
              form. Save the page or chapter afterward to keep the change.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRemoveOpen(false)}
            >
              Cancel
            </Button>
            <Button type="button" variant="destructive" onClick={confirmRemove}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
