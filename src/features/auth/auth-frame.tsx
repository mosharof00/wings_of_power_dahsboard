/**
 * Staff auth shell: left brand hero + white form panel.
 *
 * Use a plain <img> (not next/image) so swapping files in /public/auth
 * is not stuck behind Next's image optimizer cache.
 */
export function AuthFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh items-center justify-center bg-[#f3f4f6] p-4 sm:p-6 lg:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(16,24,48,0.12)] lg:min-h-[640px] lg:grid-cols-2">
        <div className="relative hidden min-h-[640px] bg-[#1a120b] lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/auth/login-hero.png"
            alt="Wings of Power dashboard preview"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </div>
        <div className="flex items-center justify-center px-6 py-10 sm:px-10 lg:px-12">
          <div className="w-full max-w-md text-foreground">{children}</div>
        </div>
      </div>
    </div>
  );
}
