import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, Users, Edit, Trash2, X, Filter } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import apiService from '../services/apiService';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [bookings, filter]);

  const fetchBookings = async () => {
    try {
      const response = await apiService.bookings.getMyBookings();
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let filtered = bookings;

    switch (filter) {
      case 'active':
        filtered = bookings.filter(booking => booking.status === 'active');
        break;
      case 'upcoming':
        filtered = bookings.filter(booking => 
          booking.status === 'active' && new Date(booking.startTime) > new Date()
        );
        break;
      case 'past':
        filtered = bookings.filter(booking => 
          new Date(booking.endTime) < new Date()
        );
        break;
      case 'cancelled':
        filtered = bookings.filter(booking => booking.status === 'cancelled');
        break;
      default:
        filtered = bookings;
    }

    setFilteredBookings(filtered.sort((a, b) => new Date(b.startTime) - new Date(a.startTime)));
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await apiService.bookings.cancel(bookingId);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel booking';
      toast.error(message);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      await apiService.bookings.delete(bookingId);
      toast.success('Booking deleted successfully');
      fetchBookings();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete booking';
      toast.error(message);
    }
  };

  const getBookingTimeText = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (isToday(start)) {
      return `Today ${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
    } else if (isTomorrow(start)) {
      return `Tomorrow ${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`;
    } else {
      return `${format(start, 'MMM dd, HH:mm')} - ${format(end, 'HH:mm')}`;
    }
  };

  const getStatusColor = (booking) => {
    if (booking.status === 'cancelled') return 'bg-red-100 text-red-800';
    if (isPast(new Date(booking.endTime))) return 'bg-gray-100 text-gray-800';
    if (booking.status === 'active') return 'bg-green-100 text-green-800';
    return 'bg-blue-100 text-blue-800';
  };

  const getStatusText = (booking) => {
    if (booking.status === 'cancelled') return 'Cancelled';
    if (isPast(new Date(booking.endTime))) return 'Completed';
    if (booking.status === 'active') return 'Active';
    return booking.status;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="mt-2 text-gray-600">Manage your meeting room reservations.</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'all', label: 'All Bookings' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'active', label: 'Active' },
              { key: 'past', label: 'Past' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div key={booking._id} className="card hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{booking.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking)}`}>
                      {getStatusText(booking)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{booking.room?.name} - {booking.room?.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-sm">{getBookingTimeText(booking.startTime, booking.endTime)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span className="text-sm">{booking.attendees} attendees</span>
                    </div>
                  </div>

                  {booking.description && (
                    <p className="text-gray-600 text-sm mb-4">{booking.description}</p>
                  )}

                  {booking.isRecurring && (
                    <div className="flex items-center text-primary-600 text-sm mb-4">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Recurring meeting</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {booking.status === 'active' && new Date(booking.startTime) > new Date() && (
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                      title="Cancel booking"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBooking(booking._id)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                      title="Delete booking"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? "You haven't made any bookings yet."
                : `No ${filter} bookings found.`
              }
            </p>
            <div className="mt-6">
              <a
                href="/rooms"
                className="btn-primary"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book a Room
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookings;
