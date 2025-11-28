import React, { useState, useEffect } from 'react';
import {
  addMonths,
  subMonths,
  addDays,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday,
  parseISO,
  isSameDay
} from 'date-fns';
import axios from 'axios';
import { FaUser, FaUserTie, FaRupeeSign, FaCalendarAlt, FaClock, FaPhone, FaPlus } from 'react-icons/fa';
import { createPortal } from 'react-dom';
import CreateEventModal from '../sales/CreateEventModal';
// import CalendarWeek from './CalendarWeek';

const CalendarMonth = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState('month'); // 'month', 'week', or 'day'
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, date: null });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEventDate, setSelectedEventDate] = useState(null);

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/sales`);
      setEvents(response.data.sales || []);
      return true;
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again later.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  const navigate = (direction) => {
    if (view === 'day') {
      setCurrentDate(addDays(currentDate, direction === 'prev' ? -1 : 1));
    } else if (view === 'week') {
      setCurrentDate(addDays(currentDate, direction === 'prev' ? -7 : 7));
    } else {
      setCurrentDate(addMonths(currentDate, direction === 'prev' ? -1 : 1));
    }
  };

  const handlePrev = () => navigate('prev');
  const handleNext = () => navigate('next');
  
  const handleToday = () => setCurrentDate(new Date());

  const handleMonthSelect = (e) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(e.target.value));
    setCurrentDate(newDate);
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const handleDayClick = (day, e) => {
    if (e && e.type === 'contextmenu') {
      e.preventDefault();
      setContextMenu({
        show: true,
        x: e.clientX,
        y: e.clientY,
        date: day
      });
    } else {
      setSelectedDate(day);
    }
  };

  const handleContextMenuAction = (action, date) => {
    if (action === 'create') {
      setSelectedEventDate(date);
      setShowCreateModal(true);
    }
    setContextMenu({ ...contextMenu, show: false });
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setSelectedEventDate(null);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-orange-500';
      case 'confirmed':
        return 'bg-blue-500';
      case 'completed':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'bg-red-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) return <div className="w-full h-full flex items-center justify-center">Loading...</div>;
  if (error) return <div className="w-full h-full flex items-center justify-center text-red-500">{error}</div>;

  return (
    <div className="w-full h-full bg-slate-950 rounded-lg p-6 shadow-lg flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold text-white">
            {view === 'month' && `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`}
            {view === 'week' && `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 0 }), 'MMM d')} - ${format(endOfWeek(currentDate, { weekStartsOn: 0 }), 'MMM d, yyyy')}`}
            {view === 'day' && format(currentDate, 'EEEE, MMMM d, yyyy')}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            {/* <button
              type="button"
              onClick={() => setView('month')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${view === 'month' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
            >
              Month
            </button> */}
          </div>
          
          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={handlePrev}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-gray-200 rounded-md"
              title={`Previous ${view}`}
            >
              ‹
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-gray-200 rounded-md"
              title="Today"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-gray-200 rounded-md"
              title={`Next ${view}`}
            >
              ›
            </button>
          </div>
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

      {/* Calendar Content */}
      {view === 'day' ? (
        <CalendarDay 
          currentDate={currentDate}
          getEventsForDay={getEventsForDay}
        />
      ) : view === 'week' ? (
        <CalendarWeek 
          currentDate={currentDate}
          getEventsForDay={getEventsForDay}
        />
      ) : (
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
                <div className="mt-8 space-y-1">
                {dayEvents.slice(0, 2).map((event, idx) => (
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
                  {dayEvents.length > 2 && (
                   <div className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer pt-1">
                    +{dayEvents.length - 2} more
                  </div>
                )}
                </div>

                <div 
                onClick={() => handleDayClick(day, { type: 'click' })}
                onContextMenu={(e) => handleDayClick(day, e)}
                className="absolute inset-0 opacity-0 group-hover:bg-slate-800/20 group-hover:opacity-100 transition-all rounded-md cursor-pointer"
              ></div>
              </div>
            );
          })}
        </div>
      )}
      
      {/* Selected Day Events */}
      {selectedDate && (
        <div className="mt-8 bg-slate-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>
          
          {getEventsForDay(selectedDate).length > 0 ? (
            <div className="space-y-4">
              {getEventsForDay(selectedDate).map((event, idx) => (
                <div key={idx} className="bg-slate-800 rounded-lg p-4 hover:bg-slate-700 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-xl font-medium text-white">{event.studentName}</h4>
                      <p className="text-gray-300">{event.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                        {event.status || 'pending'}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(event.priority)}`}>
                        {event.priority || 'medium'}
                      </span>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-500">
                        {event.type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm space-y-2">
                    <div className="flex items-center text-gray-300">
                      <FaCalendarAlt className="mr-3 w-5 text-blue-400" />
                      <span>{format(parseISO(event.date), 'MMM d, yyyy')} • {event.time || 'No time specified'}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <FaPhone className="mr-3 w-5 text-blue-400" />
                      <span>{event.contacts?.[0]?.number || 'No contact number'}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <FaUserTie className="mr-3 w-5 text-blue-400" />
                      <span>{event.createdBy || 'Not assigned'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No events scheduled for this day
            </div>
          )}
        </div>
      )}
      
      {/* Context Menu */}
      {contextMenu.show && createPortal(
        <div 
          className="fixed bg-slate-800 border border-slate-700 rounded-md shadow-lg py-1 z-50"
          style={{
            top: `${contextMenu.y}px`,
            left: `${contextMenu.x}px`,
          }}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => handleContextMenuAction('create', contextMenu.date)}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-200 hover:bg-slate-700 text-left"
          >
            <FaPlus className="mr-2" />
            Create Event
          </button>
        </div>,
        document.body
      )}

      {/* Close context menu when clicking outside */}
      {contextMenu.show && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setContextMenu({ ...contextMenu, show: false })}
        />
      )}

      {/* Create Event Modal */}
      {showCreateModal && selectedEventDate && (
        <CreateEventModal
          isOpen={showCreateModal}
          onClose={closeCreateModal}
          onSuccess={async () => {
            try {
              const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/sales`);
              setEvents(response.data.sales || []);
              closeCreateModal();
            } catch (err) {
              console.error("Error refreshing events:", err);
              toast.error("Failed to refresh events");
              closeCreateModal();
            }
          }}
          initialDate={format(selectedEventDate, 'yyyy-MM-dd')}
        />
      )}
    </div>
  );
};

export default CalendarMonth;