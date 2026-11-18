"use client";

import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "cn";

export const authInputClass =
  "h-11 rounded-lg border border-input bg-white px-3 text-base text-foreground shadow-none placeholder:text-muted-foreground md:text-sm";

export const authInputWithIconClass = `${authInputClass} pl-10`;

export function AuthBrandMark() {
  return (
    <div className="mb-6 lg:hidden">
      <p className="text-xl font-semibold text-foreground">
        Wings of <span className="text-primary">Power</span>
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Faith & Gabriel Against Bullying
      </p>
    </div>
  );
}

export function AuthHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: ReactNode;
}) {
  return (
    <div className="mb-8">
      <AuthBrandMark />
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

/** Six visible digit boxes (bordered) for email OTP / reset codes. */
export function OtpCodeInput({
  value,
  onChange,
  onBlur,
  inputRef,
  disabled = false,
}: {
  value: string;
  onChange: (next: string) => void;
  onBlur?: () => void;
  inputRef?: (node: HTMLInputElement | null) => void;
  disabled?: boolean;
}) {
  const cells = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] ?? "");

  function setDigit(index: number, raw: string) {
    const digit = raw.replace(/\D/g, "").slice(-1);
    const next = Array.from({ length: 6 }, (_, slot) => digits[slot] ?? "");
    next[index] = digit;
    onChange(next.join(""));
    if (digit && index < 5) cells.current[index + 1]?.focus();
  }

  return (
    <div className="flex w-full justify-between gap-2 sm:gap-3">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            cells.current[index] = node;
            if (index === 0) inputRef?.(node);
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${index + 1}`}
          maxLength={1}
          disabled={disabled}
          placeholder="-"
          value={digit}
          onBlur={onBlur}
          onChange={(event) => setDigit(index, event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Backspace" && !digits[index] && index > 0) {
              cells.current[index - 1]?.focus();
            }
          }}
          onFocus={(event) => event.currentTarget.select()}
          onPaste={(event) => {
            const text = event.clipboardData
              .getData("text")
              .replace(/\D/g, "")
              .slice(0, 6);
            if (!text) return;
            event.preventDefault();
            onChange(text);
            cells.current[Math.min(text.length, 5)]?.focus();
          }}
          className={cn(
            "h-12 w-10 shrink-0 rounded-xl border-2 border-[#D8DCE3] bg-white text-center text-lg font-semibold text-foreground shadow-none outline-none transition sm:h-14 sm:w-12",
            "placeholder:text-[#C5CAD3] placeholder:font-medium",
            "focus:border-primary focus:ring-2 focus:ring-primary/25",
            "disabled:cursor-not-allowed disabled:opacity-60",
          )}
        />
      ))}
    </div>
  );
}

export function AuthFooter({
  prompt,
  href,
  label,
}: {
  prompt: string;
  href: string;
  label: string;
}) {
  return (
    <p className="text-center text-sm text-muted-foreground">
      {prompt}{" "}
      <Link href={href} className="font-medium text-primary">
        {label}
      </Link>
    </p>
  );
}

export function AuthSubmit({
  children,
  pending,
  disabled = false,
}: {
  children: string;
  pending: boolean;
  disabled?: boolean;
}) {
  return (
    <Button type="submit" className="h-11 w-full" disabled={pending || disabled}>
      {children}
    </Button>
  );
}

export function RootError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-sm text-destructive">
      {message}
    </p>
  );
}

export function EmailInput({
  placeholder,
  autoComplete,
  ...field
}: {
  placeholder: string;
  autoComplete: string;
} & React.ComponentProps<"input">) {
  return (
    <div className="relative">
      <Mail
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        {...field}
        type="email"
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={authInputWithIconClass}
      />
    </div>
  );
}

export function PasswordInput({
  placeholder,
  autoComplete,
  ...field
}: {
  placeholder: string;
  autoComplete: string;
} & React.ComponentProps<"input">) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Lock
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        {...field}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${authInputWithIconClass} pr-10`}
      />
      <button
        type="button"
        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
    </div>
  );
}
