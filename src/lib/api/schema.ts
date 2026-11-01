import type { AuthSession, AuthUser } from "./types";
import type { Envelope } from "./envelope";

type Json<T> = {
  responses: {
    200: {
      content: {
        "application/json": Envelope<T>;
      };
    };
  };
};

type Body<T> = {
  requestBody: {
    required: true;
    content: {
      "application/json": T;
    };
  };
};

type MethodName =
  | "get"
  | "put"
  | "post"
  | "delete"
  | "options"
  | "head"
  | "patch"
  | "trace";

type Endpoint<Used extends MethodName, Operation> = {
  [Method in Exclude<MethodName, Used>]?: never;
} & Record<Used, Operation>;

/**
 * Staff auth paths from docs/API.md section 1.
 * `npm run openapi:generate` replaces this file when a document exists.
 * No OpenAPI document was available when this task landed.
 */
export interface paths {
  "/auth/admin/register": Endpoint<
    "post",
    Body<{ email: string; password: string; name: string }> & Json<unknown>
  >;
  "/auth/admin/verify-email": Endpoint<
    "post",
    Body<{ email: string; code: string }> & Json<unknown>
  >;
  "/auth/admin/login": Endpoint<
    "post",
    Body<{ email: string; password: string }> & Json<AuthSession>
  >;
  "/auth/admin/forgot-password": Endpoint<
    "post",
    Body<{ email: string }> & Json<unknown>
  >;
  "/auth/admin/reset-password": Endpoint<
    "post",
    Body<{ token: string; password: string }> & Json<unknown>
  >;
  "/auth/school": Endpoint<
    "post",
    Body<Record<string, unknown>> & Json<unknown>
  >;
  "/auth/teacher/accept-invite": Endpoint<
    "post",
    Body<{ token: string; password: string; name: string }> & Json<AuthUser>
  >;
  "/auth/staff/login": Endpoint<
    "post",
    Body<{ email: string; password: string }> & Json<AuthSession>
  >;
  "/auth/me": Endpoint<"get", Json<AuthUser>>;
  "/auth/logout": Endpoint<"post", Json<unknown>>;
  "/auth/password": Endpoint<
    "patch",
    Body<{ current: string; next: string }> & Json<unknown>
  >;
}
