"use client";

import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  Underline as UnderlineIcon,
} from "lucide-react";
import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import { Color, FontSize, TextStyle } from "@tiptap/extension-text-style";
import { cn } from "@/lib/utils";

const FONT_SIZES = ["14px", "16px", "18px", "20px", "24px", "32px"];

const COLORS = [
  { label: "Default", value: "#333333" },
  { label: "Orange", value: "#F97316" },
  { label: "Blue", value: "#2563EB" },
  { label: "Green", value: "#16A34A" },
  { label: "Red", value: "#DC2626" },
  { label: "Purple", value: "#7C3AED" },
];

function looksLikeHtml(value: string) {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export function stripHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function toEditorHtml(value: string) {
  const trimmed = value?.trim() ?? "";
  if (!trimmed) return "";
  if (looksLikeHtml(trimmed)) return trimmed;
  return `<p>${trimmed
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>")}</p>`;
}

export function PageHtmlEditor({
  id,
  value,
  onChange,
  placeholder = "Write the page text here…",
  disabled = false,
}: {
  id?: string;
  value: string;
  onChange: (nextHtml: string) => void;
  placeholder?: string;
  disabled?: boolean;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
        horizontalRule: false,
      }),
      Underline,
      TextStyle,
      Color,
      FontSize,
      TextAlign.configure({ types: ["paragraph"] }),
    ],
    content: toEditorHtml(value),
    editable: !disabled,
    editorProps: {
      attributes: {
        id: id ?? "page-html-editor",
        class:
          "min-h-[220px] max-h-[420px] overflow-y-auto px-3 py-3 text-sm leading-relaxed text-foreground outline-none sm:min-h-[280px] prose prose-sm max-w-none focus:outline-none",
        "aria-label": "Page text",
      },
    },
    onUpdate: ({ editor: current }) => {
      const html = current.isEmpty ? "" : current.getHTML();
      onChange(html);
    },
  });

  useEffect(() => {
    if (!editor) return;
    editor.setEditable(!disabled);
  }, [disabled, editor]);

  useEffect(() => {
    if (!editor) return;
    const next = toEditorHtml(value);
    const current = editor.isEmpty ? "" : editor.getHTML();
    if (next === current) return;
    if (stripHtml(next) === stripHtml(current) && next === "" && current === "") return;
    // Only sync when parent value diverges (reload / page switch), not every keystroke.
    if (stripHtml(next) !== stripHtml(current) || next !== current) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="min-h-[220px] rounded-xl border border-input bg-muted/20 sm:min-h-[280px]" />
    );
  }

  const empty = editor.isEmpty || stripHtml(editor.getHTML()) === "";

  return (
    <div className="overflow-hidden rounded-xl border border-input bg-background shadow-xs">
      <div className="flex flex-wrap items-center gap-1 border-b bg-muted/40 px-2 py-1.5">
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Underline"
          active={editor.isActive("underline")}
          disabled={disabled}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className="size-3.5" />
        </ToolbarButton>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden />

        <label className="flex items-center gap-1 text-xs text-muted-foreground">
          Size
          <select
            aria-label="Font size"
            disabled={disabled}
            className="h-8 rounded-md border border-input bg-background px-1.5 text-xs"
            value={editor.getAttributes("textStyle").fontSize || "16px"}
            onChange={(event) => {
              const size = event.target.value;
              if (!size) {
                editor.chain().focus().unsetFontSize().run();
                return;
              }
              editor.chain().focus().setFontSize(size).run();
            }}
          >
            {FONT_SIZES.map((size) => (
              <option key={size} value={size}>
                {size.replace("px", "")}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-1 text-xs text-muted-foreground">
          Color
          <select
            aria-label="Text color"
            disabled={disabled}
            className="h-8 rounded-md border border-input bg-background px-1.5 text-xs"
            value={editor.getAttributes("textStyle").color || "#333333"}
            onChange={(event) => {
              editor.chain().focus().setColor(event.target.value).run();
            }}
          >
            {COLORS.map((color) => (
              <option key={color.value} value={color.value}>
                {color.label}
              </option>
            ))}
          </select>
        </label>

        <span className="mx-1 h-5 w-px bg-border" aria-hidden />

        <ToolbarButton
          label="Align left"
          active={editor.isActive({ textAlign: "left" })}
          disabled={disabled}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Align center"
          active={editor.isActive({ textAlign: "center" })}
          disabled={disabled}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter className="size-3.5" />
        </ToolbarButton>
        <ToolbarButton
          label="Align right"
          active={editor.isActive({ textAlign: "right" })}
          disabled={disabled}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight className="size-3.5" />
        </ToolbarButton>
      </div>

      <div className="relative">
        {empty ? (
          <p className="pointer-events-none absolute top-3 left-3 z-10 text-sm text-muted-foreground">
            {placeholder}
          </p>
        ) : null}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

function ToolbarButton({
  label,
  children,
  onClick,
  disabled,
  active,
}: {
  label: string;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-md text-foreground hover:bg-background disabled:opacity-50",
        active && "bg-background text-primary shadow-sm",
      )}
    >
      {children}
    </button>
  );
}
