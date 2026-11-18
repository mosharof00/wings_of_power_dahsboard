"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { applyApiFormError } from "@/components/feedback/apply-api-form-error";
import { toastSuccess } from "@/components/feedback/toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { forgotPassword, resetPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/envelope";
import {
  AuthFooter,
  AuthHeading,
  AuthSubmit,
  EmailInput,
  OtpCodeInput,
  PasswordInput,
  RootError,
} from "./auth-ui";
import {
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  type ForgotPasswordValues,
  type ResetPasswordValues,
  type VerifyEmailValues,
} from "./schemas";

type Step = "email" | "otp" | "password";

const OTP_SECONDS = 60;

export function ForgotPasswordForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(OTP_SECONDS);

  const emailForm = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });
  const otpForm = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { code: "" },
  });
  const passwordForm = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirm: "" },
  });

  useEffect(() => {
    if (step !== "otp") return;
    if (secondsLeft <= 0) return;
    const timer = window.setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [step, secondsLeft]);

  async function sendCode(targetEmail: string) {
    await forgotPassword({ email: targetEmail });
    setEmail(targetEmail);
    setSecondsLeft(OTP_SECONDS);
    setStep("otp");
    otpForm.reset({ code: "" });
    toastSuccess({
      title: "Code sent",
      description: "Enter the 6-digit code from your email. It expires in 1 minute.",
    });
  }

  async function onEmailSubmit(values: ForgotPasswordValues) {
    try {
      await sendCode(values.email.trim());
    } catch (error) {
      applyApiFormError(emailForm, {
        message:
          error instanceof ApiError ? error.message : "Could not send the reset code.",
      });
    }
  }

  async function onOtpSubmit(values: VerifyEmailValues) {
    if (secondsLeft <= 0) {
      otpForm.setError("root", {
        message: "This code expired. Request a new one.",
      });
      return;
    }
    setOtp(values.code);
    setStep("password");
  }

  async function onPasswordSubmit(values: ResetPasswordValues) {
    try {
      await resetPassword({
        token: otp,
        password: values.password,
        confirmPassword: values.confirm,
      });
      toastSuccess({
        title: "Password updated",
        description: "Sign in with your new password.",
      });
      router.push("/sign-in");
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Could not set the password.";
      if (/expired|invalid/i.test(message)) {
        setStep("otp");
        otpForm.setError("root", { message });
        toast.error(message);
        return;
      }
      applyApiFormError(passwordForm, { message });
    }
  }

  async function onResend() {
    try {
      await sendCode(email);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? error.message : "Could not resend the code.",
      );
    }
  }

  if (step === "password") {
    return (
      <Form {...passwordForm}>
        <form
          className="grid gap-5"
          onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
          noValidate
        >
          <AuthHeading
            title="Set New Password"
            subtitle="Must be at least 8 characters"
          />
          <FormField
            control={passwordForm.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">New password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={passwordForm.control}
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">Confirm Password</FormLabel>
                <FormControl>
                  <PasswordInput
                    {...field}
                    placeholder="Re-enter your password"
                    autoComplete="new-password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <RootError message={passwordForm.formState.errors.root?.message} />
          <AuthSubmit pending={passwordForm.formState.isSubmitting}>
            Set New Password
          </AuthSubmit>
        </form>
      </Form>
    );
  }

  if (step === "otp") {
    return (
      <Form {...otpForm}>
        <form
          className="grid gap-5"
          onSubmit={otpForm.handleSubmit(onOtpSubmit)}
          noValidate
        >
          <AuthHeading
            title="Verify Code"
            subtitle={
              <>
                Enter the 6-digit code sent to{" "}
                <span className="font-medium text-primary">{email}</span>
              </>
            }
          />
          <p
            role="status"
            className={
              secondsLeft > 0
                ? "text-sm text-muted-foreground"
                : "text-sm font-medium text-destructive"
            }
          >
            {secondsLeft > 0
              ? `OTP will expire within 1 min (${secondsLeft}s left)`
              : "Code expired — request a new one"}
          </p>
          <FormField
            control={otpForm.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <OtpCodeInput
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    inputRef={field.ref}
                    disabled={secondsLeft <= 0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <RootError message={otpForm.formState.errors.root?.message} />
          <AuthSubmit
            pending={otpForm.formState.isSubmitting}
            disabled={secondsLeft <= 0}
          >
            Verify
          </AuthSubmit>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t receive code?{" "}
            <button
              type="button"
              className="font-medium text-primary disabled:opacity-50"
              onClick={() => void onResend()}
              disabled={otpForm.formState.isSubmitting}
            >
              Resend Again
            </button>
          </p>
          <AuthFooter
            prompt="Remember your password?"
            href="/sign-in"
            label="Back to login"
          />
        </form>
      </Form>
    );
  }

  return (
    <Form {...emailForm}>
      <form
        className="grid gap-5"
        onSubmit={emailForm.handleSubmit(onEmailSubmit)}
        noValidate
      >
        <AuthHeading
          title="Reset Your Password"
          subtitle="Enter your email for the verification code"
        />
        <FormField
          control={emailForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-foreground">Email</FormLabel>
              <FormControl>
                <EmailInput
                  {...field}
                  autoComplete="email"
                  placeholder="Enter your email address"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <RootError message={emailForm.formState.errors.root?.message} />
        <AuthSubmit pending={emailForm.formState.isSubmitting}>Submit</AuthSubmit>
        <AuthFooter
          prompt="Remember your password?"
          href="/sign-in"
          label="Back to login"
        />
      </form>
    </Form>
  );
}
