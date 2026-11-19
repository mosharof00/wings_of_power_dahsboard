import { Suspense } from "react";
import { ThemesView } from "@/features/admin/themes/themes-view";

export default function AdminThemesPage() {
  return (
    <Suspense>
      <ThemesView />
    </Suspense>
  );
}
