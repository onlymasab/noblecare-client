import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const AppointmentCalendar = () => {
  const events = [
    { title: 'Meeting', date: '2025-05-28' },
    { title: 'Dentist Appointment', date: '2025-05-29' },
    { title: 'Project Deadline', date: '2025-06-01' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Appointment Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          selectable={true}
          dateClick={(info) => alert(`Clicked on ${info.dateStr}`)}
          eventClick={(info) => alert(`Event: ${info.event.title}`)}
        />
      </CardContent>
    </Card>
  );
};