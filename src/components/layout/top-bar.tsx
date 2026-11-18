import { Bell, Menu, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { studentsListPath, type DashboardRole } from "./nav";

export function TopBar({
  title,
  role,
  displayName,
  initial,
  onOpenNav,
}: {
  title: string;
  role: DashboardRole;
  displayName: string;
  initial: string;
  onOpenNav?: () => void;
}) {
  return (
    <header className="flex items-center gap-2 rounded-2xl bg-card px-3 py-2.5 sm:gap-4 sm:px-5 sm:py-3">
      {onOpenNav ? (
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onOpenNav}
          className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-foreground hover:bg-muted lg:hidden"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>
      ) : null}

      <h1 className="min-w-0 truncate text-base font-semibold text-primary sm:text-lg">
        {title}
      </h1>

      <form
        action={studentsListPath(role)}
        method="get"
        role="search"
        className="ml-auto hidden sm:block"
      >
        <div className="relative w-48 md:w-72">
          <button
            type="submit"
            aria-label="Search"
            className="absolute top-1/2 left-3 z-10 -translate-y-1/2 text-muted-foreground"
          >
            <Search className="size-4" aria-hidden="true" />
          </button>
          <Input
            name="q"
            type="search"
            placeholder="Search students…"
            aria-label="Search students"
            className="h-10 rounded-full bg-background pl-9"
          />
        </div>
      </form>

      <button
        type="button"
        aria-label="Notifications"
        className="relative inline-flex size-10 shrink-0 items-center justify-center rounded-full text-foreground"
      >
        <Bell className="size-5" aria-hidden="true" />
        <span className="absolute top-1 right-1 inline-flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] leading-4 font-medium text-primary-foreground">
          3
        </span>
      </button>

      <div className="flex min-w-0 items-center gap-2">
        <Avatar className="size-9 shrink-0 after:border-0">
          <AvatarFallback className="bg-primary text-sm font-medium text-primary-foreground">
            {initial}
          </AvatarFallback>
        </Avatar>
        <span className="hidden max-w-[10rem] truncate text-sm font-medium text-foreground md:inline">
          {displayName}
        </span>
      </div>
    </header>
  );
}
