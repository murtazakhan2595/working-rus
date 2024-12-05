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
          { title: 'Event 1', date: '2024-12-04' },
          { title: 'Event 2', date: '2024-12-04' },
        ]}
        nowIndicator={true}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'dayGridMonth,timeGridWeek,timeGridDay,listMonth',
          center: 'title',
          right: 'prev,today,next',
        }}
      />
    </div>
  );
};

export default Calendar;
