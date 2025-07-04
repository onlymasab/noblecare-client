

import { AppointmentCalendar } from "@/components/appointment-chart";
export default function AppointmentPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <AppointmentCalendar />
        </div>
      </div>
    </div>
  );
}