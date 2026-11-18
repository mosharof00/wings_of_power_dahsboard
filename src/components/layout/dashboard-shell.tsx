"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "@/lib/auth/session";
import { pageTitle, roleFromLocation } from "./nav";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const role = roleFromLocation(pathname);
  const title = pageTitle(role, pathname);
  const session = useSession();
  const displayName = session.user?.name?.trim() || session.user?.email || "Staff";
  const initial = displayName.slice(0, 1).toUpperCase();

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    if (!mobileNavOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileNavOpen]);

  async function confirmLogout() {
    setLoggingOut(true);
    try {
      await session.logout();
    } finally {
      setLoggingOut(false);
      setLogoutOpen(false);
    }
  }

  return (
    <div className="flex h-svh overflow-hidden bg-background">
      {/* Desktop sidebar — fixed, non-scrolling chrome */}
      <div className="hidden h-svh shrink-0 lg:block">
        <Sidebar
          role={role}
          pathname={pathname}
          onLogout={() => setLogoutOpen(true)}
        />
      </div>

      {/* Mobile drawer */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileNavOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex h-full w-[min(280px,86vw)] shadow-xl">
            <Sidebar
              role={role}
              pathname={pathname}
              onLogout={() => {
                setMobileNavOpen(false);
                setLogoutOpen(true);
              }}
              onNavigate={() => setMobileNavOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="shrink-0 border-b border-border/60 bg-background px-3 py-3 sm:px-4 md:px-6">
          <TopBar
            title={title}
            role={role}
            displayName={displayName}
            initial={initial}
            onOpenNav={() => setMobileNavOpen(true)}
          />
        </div>
        <main className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4 md:px-6 md:py-6">
          {children}
        </main>
      </div>

      <Dialog open={logoutOpen} onOpenChange={setLogoutOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Log out?</DialogTitle>
            <DialogDescription>
              You will need to sign in again to use the dashboard.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 flex-row justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={loggingOut}
              onClick={() => setLogoutOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={loggingOut}
              onClick={() => void confirmLogout()}
            >
              {loggingOut ? "Logging out…" : "Log out"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
