import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import luxonPlugin from '@fullcalendar/luxon3';

const Calendar = () => {
  return (
    <div className="min-w-[75%] p-4 bg-gray-100 rounded-lg shadow-lg">
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          listPlugin,
          luxonPlugin,
        ]}
        height="70vh"
        events={[
          { title: 'Event 1', date: '2024-12-01' },
          { title: 'Event 2', date: '2024-12-02' },
        ]}
        nowIndicator={true}
        initialView="timeGridDay"
        headerToolbar={{
          left: 'prev,today,next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
        }}
      />
    </div>
  );
};

export default Calendar;
