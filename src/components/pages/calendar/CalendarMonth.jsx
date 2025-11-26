import React, { useState, useEffect } from "react";
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday,
  addDays,
  parseISO,
  isSameDay
} from "date-fns";
import axios from "axios";

const CalendarMonth = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/sales`);
        setEvents(response.data.sales || []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const weekStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

  const calendarDays = [];
  let day = weekStart;

  while (day <= weekEnd) {
    calendarDays.push(day);
    day = addDays(day, 1);
  }

  const getEventsForDay = (day) => {
    return events.filter(event => {
      const eventDate = parseISO(event.date);
      return isSameDay(eventDate, day);
    });
  };

  const handlePrev = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNext = () => setCurrentDate(addMonths(currentDate, 1));

  const handleMonthSelect = (e) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(e.target.value));
    setCurrentDate(newDate);
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  if (loading) return <div className="w-full h-full flex items-center justify-center">Loading...</div>;
  if (error) return <div className="w-full h-full flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="w-full h-full bg-slate-950 rounded-lg p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-200 rounded-md"
          >
            ‹ Prev
          </button>
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-gray-200 rounded-md"
          >
            Next ›
          </button>
          <h2 className="text-xl font-semibold text-white ml-3">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>
        
        <select
          value={currentDate.getMonth()}
          onChange={handleMonthSelect}
          className="bg-slate-800 px-3 py-2 rounded-md border border-slate-700 text-gray-200"
        >
          {months.map((m, index) => (
            <option key={index} value={index} className="text-black">
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Weekdays Header */}
      <div className="grid grid-cols-7 text-center py-3 border-b border-slate-700 text-gray-300 font-medium">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-0 border-l border-t border-slate-800">
        {calendarDays.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const today = isToday(day);
          const dayEvents = getEventsForDay(day);

          return (
            <div
              key={index}
              className={`h-32 border-r border-b border-slate-800 p-2 relative group ${
                !isCurrentMonth ? 'bg-slate-900/50' : ''
              }`}
            >
              <div
                className={`absolute top-2 right-2 text-sm font-medium w-7 h-7 
                  flex items-center justify-center rounded-full 
                  ${
                    today
                      ? "bg-amber-500 text-white shadow"
                      : isCurrentMonth
                      ? "text-gray-200"
                      : "text-gray-500"
                  }
                `}
              >
                {format(day, "d")}
              </div>

              {/* Events */}
              <div className="mt-8 space-y-1 overflow-y-auto max-h-20">
                {dayEvents.map((event, idx) => (
                  <div
                    key={idx}
                    className={`text-xs p-1 rounded truncate ${
                      event.status === 'confirmed' ? 'bg-green-900/50 text-green-300' :
                      event.status === 'pending' ? 'bg-yellow-900/50 text-yellow-300' :
                      'bg-red-900/50 text-red-300'
                    }`}
                    title={`${event.studentName} - ${event.type} (${event.time})`}
                  >
                    {event.time} - {event.studentName}
                  </div>
                ))}
              </div>

              <div className="absolute inset-0 opacity-0 group-hover:bg-slate-800/20 group-hover:opacity-100 transition-all rounded-md pointer-events-none"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarMonth;