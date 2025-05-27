import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export const AppointmentCalendar = () => {
  const events = [
    { title: 'Meeting', date: '2025-05-28' },
    { title: 'Dentist Appointment', date: '2025-05-29' },
    { title: 'Project Deadline', date: '2025-06-01' },
    { title: 'Workshop', date: '2025-06-05' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Appointment Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
          }}
          views={{
            dayGridMonth: { buttonText: 'Month' },
            timeGridWeek: { buttonText: 'Week' },
            timeGridDay: { buttonText: 'Day' },
            listMonth: { buttonText: 'List' },
          }}
          events={events}
          selectable={true}
          dateClick={(info) => alert(`Clicked on ${info.dateStr}`)}
          eventClick={(info) => alert(`Event: ${info.event.title}`)}
          height="auto"
        />
      </CardContent>
    </Card>
  );
};