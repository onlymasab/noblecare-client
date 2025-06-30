import React, { useState, useRef, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarIcon, Plus, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface Event {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  color?: string;
}

export const AppointmentCalendar = () => {
  const calendarRef = useRef<FullCalendar>(null);
  const [events, setEvents] = useState<Event[]>([
    { id: '1', title: 'Meeting', start: '2025-05-28T10:00:00', end: '2025-05-28T11:30:00', color: '#3b82f6' },
    { id: '2', title: 'Dentist Appointment', start: '2025-05-29T14:00:00', end: '2025-05-29T15:00:00', color: '#ef4444' },
    { id: '3', title: 'Project Deadline', start: '2025-06-01', allDay: true, color: '#10b981' },
    { id: '4', title: 'Workshop', start: '2025-06-05T09:00:00', end: '2025-06-05T17:00:00', color: '#f59e0b' },
  ]);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({ title: '', start: '', end: '', allDay: false });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState('dayGridMonth');

  const handleDateClick = (arg: any) => {
    setNewEvent({
      title: '',
      start: arg.dateStr,
      end: arg.dateStr,
      allDay: arg.allDay
    });
    setIsDialogOpen(true);
  };

  const handleEventClick = (info: any) => {
    toast.info(
      <div className="space-y-2">
        <h3 className="font-semibold">{info.event.title}</h3>
        <p>
          {format(new Date(info.event.start), 'PPP')}
          {info.event.end && ` to ${format(new Date(info.event.end), 'PPP')}`}
        </p>
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => handleEditEvent(info.event)}>
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => handleDeleteEvent(info.event.id)}>
            Delete
          </Button>
        </div>
      </div>
    );
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start) {
      toast.error('Please fill in all required fields');
      return;
    }

    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title || '',
      start: newEvent.start as string,
      end: newEvent.end || newEvent.start as string,
      allDay: newEvent.allDay,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
    };

    setEvents([...events, event]);
    setIsDialogOpen(false);
    setNewEvent({ title: '', start: '', end: '', allDay: false });
    toast.success('Event added successfully');
  };

  const handleEditEvent = (event: any) => {
    setNewEvent({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      allDay: event.allDay,
      color: event.backgroundColor
    });
    setIsDialogOpen(true);
  };

  const handleUpdateEvent = () => {
    if (!newEvent.title || !newEvent.start) {
      toast.error('Please fill in all required fields');
      return;
    }

    setEvents(events.map(event => 
      event.id === newEvent.id ? {
        ...event,
        title: newEvent.title || '',
        start: newEvent.start as string,
        end: newEvent.end || newEvent.start as string,
        allDay: newEvent.allDay
      } : event
    ));

    setIsDialogOpen(false);
    setNewEvent({ title: '', start: '', end: '', allDay: false });
    toast.success('Event updated successfully');
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    toast.success('Event deleted successfully');
  };

  const navigateToToday = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.today();
    }
  };

  const navigatePrev = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.prev();
    }
  };

  const navigateNext = () => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.next();
    }
  };

  const changeView = (view: string) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(view);
      setView(view);
    }
  };

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={navigatePrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={navigateNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={navigateToToday}>
              Today
            </Button>
          </div>
          <h2 className="text-lg font-semibold">
            {calendarRef.current ? format(calendarRef.current.getApi().getDate(), 'MMMM yyyy') : ''}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            className="gap-1"
            onClick={() => {
              setNewEvent({ title: '', start: '', end: '', allDay: false });
              setIsDialogOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Create
          </Button>
          <div className="flex rounded-md border">
            <Button
              variant={view === 'dayGridMonth' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-r-none"
              onClick={() => changeView('dayGridMonth')}
            >
              Month
            </Button>
            <Button
              variant={view === 'timeGridWeek' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none border-l"
              onClick={() => changeView('timeGridWeek')}
            >
              Week
            </Button>
            <Button
              variant={view === 'timeGridDay' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-none border-l"
              onClick={() => changeView('timeGridDay')}
            >
              Day
            </Button>
            <Button
              variant={view === 'listMonth' ? 'default' : 'ghost'}
              size="sm"
              className="rounded-l-none border-l"
              onClick={() => changeView('listMonth')}
            >
              List
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={false}
          events={events}
          selectable={true}
          editable={true}
          droppable={true}
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          eventDrop={(info) => {
            setEvents(events.map(event => 
              event.id === info.event.id ? {
                ...event,
                start: info.event.startStr,
                end: info.event.endStr
              } : event
            ));
          }}
          eventResize={(info) => {
            setEvents(events.map(event => 
              event.id === info.event.id ? {
                ...event,
                start: info.event.startStr,
                end: info.event.endStr
              } : event
            ));
          }}
          height="calc(100vh - 200px)"
          nowIndicator={true}
          eventDisplay="block"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false
          }}
          dayHeaderFormat={{ weekday: 'short', day: 'numeric' }}
        />
      </CardContent>

      {/* Event Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{newEvent.id ? 'Edit Event' : 'Create New Event'}</DialogTitle>
            <DialogDescription>
              {newEvent.start && format(new Date(newEvent.start), 'PPPP')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <Input
                placeholder="Event title"
                value={newEvent.title}
                onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start</label>
                <Popover>
                  <PopoverTrigger>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newEvent.start ? format(new Date(newEvent.start), 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newEvent.start ? new Date(newEvent.start) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          const formattedDate = format(date, 'yyyy-MM-dd');
                          setNewEvent({
                            ...newEvent,
                            start: newEvent.allDay ? formattedDate : `${formattedDate}T00:00:00`,
                            end: newEvent.allDay ? formattedDate : `${formattedDate}T00:00:00`
                          });
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End</label>
                <Popover>
                  <PopoverTrigger>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newEvent.end ? format(new Date(newEvent.end), 'PPP') : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newEvent.end ? new Date(newEvent.end) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          const formattedDate = format(date, 'yyyy-MM-dd');
                          setNewEvent({
                            ...newEvent,
                            end: newEvent.allDay ? formattedDate : `${formattedDate}T00:00:00`
                          });
                        }
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="allDay"
                checked={newEvent.allDay || false}
                onChange={(e) => setNewEvent({ ...newEvent, allDay: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="allDay" className="text-sm font-medium">
                All day event
              </label>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={newEvent.id ? handleUpdateEvent : handleAddEvent}
              >
                {newEvent.id ? 'Update' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};