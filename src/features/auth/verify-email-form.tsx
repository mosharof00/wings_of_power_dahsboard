"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { applyApiFormError } from "@/components/feedback/apply-api-form-error";
import { toastSuccess } from "@/components/feedback/toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { verifyEmail } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/envelope";
import { writeAccessToken } from "@/lib/auth/storage";
import { AuthHeading, AuthSubmit, OtpCodeInput, RootError } from "./auth-ui";
import { goToApp } from "./navigate";
import { readPendingEmail } from "./pending-school";
import { accessTokenFrom } from "./routing";
import { verifyEmailSchema, type VerifyEmailValues } from "./schemas";

export function VerifyEmailForm() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") ?? readPendingEmail() ?? "";
  const form = useForm<VerifyEmailValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { code: "" },
  });

  async function onSubmit(values: VerifyEmailValues) {
    if (!email) {
      form.setError("root", {
        message: "Go back and enter the email you registered with.",
      });
      return;
    }
    try {
      const data = await verifyEmail({ email, code: values.code });
      const token = accessTokenFrom(data);
      if (token) {
        writeAccessToken(token, false);
        goToApp("/onboarding/school");
        return;
      }
      toastSuccess({
        title: "Email verified",
        description: "Sign in to finish setting up your school.",
      });
      router.push("/sign-in");
    } catch (error) {
      applyApiFormError(form, {
        message: error instanceof ApiError ? error.message : "Could not verify the code.",
      });
    }
  }

  return (
    <Form {...form}>
      <form className="grid gap-5" onSubmit={form.handleSubmit(onSubmit)} noValidate>
        <AuthHeading
          title="Email Verification"
          subtitle={
            email ? (
              <>
                Enter the 6-digit code sent to{" "}
                <span className="font-medium text-primary">{email}</span>
              </>
            ) : (
              "Enter the 6-digit code sent to your email"
            )
          }
        />
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <OtpCodeInput
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  inputRef={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <RootError message={form.formState.errors.root?.message} />
        <AuthSubmit pending={form.formState.isSubmitting}>Verify</AuthSubmit>
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t receive code?{" "}
          <button type="button" className="font-medium text-primary">
            Resend Again
          </button>
        </p>
      </form>
    </Form>
  );
}
