import { Suspense } from "react";
import { StaffList } from "@/features/admin/staff/staff-list";

export const instant = false;

export default function StaffPage() {
  return (
    <Suspense>
      <StaffList />
    </Suspense>
  );
}
