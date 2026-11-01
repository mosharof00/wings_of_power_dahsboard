"use client";

import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const authInputClass =
  "h-11 rounded-lg border-transparent bg-white px-3 text-base text-foreground shadow-none placeholder:text-muted-foreground md:text-sm";

export function AuthHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-8">
      <p className="text-xl font-semibold text-white">
        Wings of <span className="text-primary">Power</span>
      </p>
      <p className="mt-1 text-sm text-white/70">
        Faith & Gabriel Against Bullying
      </p>
      <h1 className="mt-8 text-3xl font-semibold text-white">{title}</h1>
      <p className="mt-2 text-sm text-white/70">{subtitle}</p>
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
    <p className="text-center text-sm text-white/80">
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
}: {
  children: string;
  pending: boolean;
}) {
  return (
    <Button type="submit" className="h-11 w-full" disabled={pending}>
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
      <Input
        {...field}
        type={visible ? "text" : "password"}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`${authInputClass} pr-10`}
      />
      <button
        type="button"
        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground"
        aria-label={visible ? "Hide password" : "Show password"}
        onClick={() => setVisible((current) => !current)}
      >
        {visible ? <EyeOff /> : <Eye />}
      </button>
    </div>
  );
}
