import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { X, Calendar, Clock, Users, FileText, Repeat } from 'lucide-react';
import { format } from 'date-fns';
import apiService from '../services/apiService';
import { parseLocalDateTime } from '../utils/dateUtils';

const BookingModal = ({ room, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    attendees: 1,
    isRecurring: false,
    recurringPattern: {
      frequency: 'weekly',
      interval: 1,
      endDate: '',
      daysOfWeek: []
    }
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('recurringPattern.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        recurringPattern: {
          ...prev.recurringPattern,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleStartTimeChange = (e) => {
    const startTime = e.target.value;
    setFormData(prev => {
      const newData = { ...prev, startTime };
      
      // If end time is set and is on a different date, clear it
      if (prev.endTime) {
        const startDate = new Date(startTime).toISOString().split('T')[0];
        const endDate = new Date(prev.endTime).toISOString().split('T')[0];
        if (startDate !== endDate) {
          newData.endTime = '';
        }
      }
      
      return newData;
    });
  };

  const handleEndTimeChange = (e) => {
    const endTime = e.target.value;
    setFormData(prev => ({ ...prev, endTime }));
  };

  const handleEndTimeBlur = (e) => {
    const endTime = e.target.value;
    const startTime = formData.startTime;
    
    // Only validate when user finishes selecting (on blur)
    if (startTime && endTime) {
      const startDate = new Date(startTime).toISOString().split('T')[0];
      const endDate = new Date(endTime).toISOString().split('T')[0];
      
      if (startDate !== endDate) {
        toast.error('Start time and end time must be on the same date');
      } else if (new Date(endTime) <= new Date(startTime)) {
        toast.error('End time must be after start time');
      }
    }
  };

  const handleDayOfWeekChange = (day) => {
    setFormData(prev => ({
      ...prev,
      recurringPattern: {
        ...prev.recurringPattern,
        daysOfWeek: prev.recurringPattern.daysOfWeek.includes(day)
          ? prev.recurringPattern.daysOfWeek.filter(d => d !== day)
          : [...prev.recurringPattern.daysOfWeek, day]
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that both start and end times are provided
    if (!formData.startTime || !formData.endTime) {
      toast.error('Please provide both start and end times');
      return;
    }

    // Validate that start and end times are on the same date
    const startDate = new Date(formData.startTime).toISOString().split('T')[0];
    const endDate = new Date(formData.endTime).toISOString().split('T')[0];
    
    if (startDate !== endDate) {
      toast.error('Start time and end time must be on the same date');
      return;
    }

    // Validate that end time is after start time
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      toast.error('End time must be after start time');
      return;
    }

    // Validate that the booking is not in the past
    if (new Date(formData.startTime) < new Date()) {
      toast.error('Cannot book a room for a past date/time');
      return;
    }

    setLoading(true);

    try {
      // Convert datetime-local values to proper Date objects in local timezone
      const startDateTime = parseLocalDateTime(formData.startTime);
      const endDateTime = parseLocalDateTime(formData.endTime);
      
      const bookingData = {
        ...formData,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        room: room._id,
        attendees: parseInt(formData.attendees)
      };

      await apiService.bookings.create(bookingData);
      toast.success('Room booked successfully!');
      onSuccess();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create booking';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const daysOfWeek = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Book {room.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <FileText className="inline w-4 h-4 mr-1" />
              Meeting Title
            </label>
            <input
              type="text"
              name="title"
              required
              className="input-field"
              placeholder="Enter meeting title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              name="description"
              rows={3}
              className="input-field"
              placeholder="Enter meeting description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Start Time
              </label>
              <input
                type="datetime-local"
                name="startTime"
                required
                className="input-field"
                value={formData.startTime}
                onChange={handleStartTimeChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                End Time
              </label>
              <input
                type="datetime-local"
                name="endTime"
                required
                className="input-field"
                value={formData.endTime}
                onChange={handleEndTimeChange}
                onBlur={handleEndTimeBlur}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <Users className="inline w-4 h-4 mr-1" />
              Number of Attendees
            </label>
            <input
              type="number"
              name="attendees"
              min="1"
              max={room.capacity}
              required
              className="input-field"
              value={formData.attendees}
              onChange={handleChange}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Room capacity: {room.capacity} people
            </p>
          </div>

          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                <Repeat className="inline w-4 h-4 mr-1" />
                Recurring Meeting
              </span>
            </label>
          </div>

          {formData.isRecurring && (
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Frequency
                  </label>
                  <select
                    name="recurringPattern.frequency"
                    className="input-field"
                    value={formData.recurringPattern.frequency}
                    onChange={handleChange}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Repeat Every
                  </label>
                  <input
                    type="number"
                    name="recurringPattern.interval"
                    min="1"
                    className="input-field"
                    value={formData.recurringPattern.interval}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {formData.recurringPattern.frequency === 'weekly' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Days of Week
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => handleDayOfWeekChange(day.value)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200 ${
                          formData.recurringPattern.daysOfWeek.includes(day.value)
                            ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 border border-primary-300 dark:border-primary-600'
                            : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-500'
                        }`}
                      >
                        {day.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  name="recurringPattern.endDate"
                  className="input-field"
                  value={formData.recurringPattern.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Calendar className="w-4 h-4 mr-2" />
              )}
              {loading ? 'Booking...' : 'Book Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
