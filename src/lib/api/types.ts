export type AuthUser = {
  id?: string;
  name?: string;
  email?: string;
  role: string;
  status?: string;
  class?: unknown;
  hero?: unknown;
};

export type AuthSession = {
  accessToken: string;
  user: AuthUser;
};
