import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Calendar, Clock, MapPin, Users, Trash2, Edit, X } from 'lucide-react';
import { format, isToday, isTomorrow, isPast } from 'date-fns';
import apiService from '../services/apiService';
import ConfirmationModal from '../components/ConfirmationModal';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState(null);
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

  const handleDeleteClick = (booking) => {
    setBookingToDelete(booking);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!bookingToDelete) return;

    try {
      await apiService.bookings.delete(bookingToDelete._id);
      toast.success('Booking deleted successfully');
      fetchBookings();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete booking';
      toast.error(message);
    } finally {
      setShowDeleteModal(false);
      setBookingToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setBookingToDelete(null);
  };

  const getBookingTimeText = (startTime, endTime) => {
    // Ensure dates are properly parsed as local time
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Bookings</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your meeting room reservations.</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex flex-wrap gap-2 sm:gap-8">
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
                className={`py-2 px-2 sm:px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  filter === tab.key
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
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
            <div key={booking._id} className="booking-card hover:shadow-md transition-shadow duration-200">
              <div className="booking-header">
                <h3 className="booking-title">{booking.title}</h3>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(booking)}`}>
                    {getStatusText(booking)}
                  </span>
                  {/* Actions */}
                  {booking.status === 'active' && new Date(booking.startTime) > new Date() && (
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md transition-colors duration-200 flex items-center whitespace-nowrap"
                      >
                        <X className="w-3 h-3 mr-1" />
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteClick(booking)}
                        className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 rounded-md transition-colors duration-200 flex items-center whitespace-nowrap"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="booking-content">
                <div className="responsive-grid">
                  <div className="flex items-center text-gray-600 dark:text-gray-400 min-w-0">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="responsive-text truncate">{booking.room?.name} - {booking.room?.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 min-w-0">
                    <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="responsive-text">{getBookingTimeText(booking.startTime, booking.endTime)}</span>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="responsive-text">{booking.attendees} attendees</span>
                  </div>
                </div>

                <div className="booking-description">
                  {booking.description && (
                    <p>{booking.description}</p>
                  )}
                </div>

                {booking.isRecurring && (
                  <div className="flex items-center text-primary-600 dark:text-primary-400 text-sm">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>Recurring meeting</span>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {filter === 'all' 
                ? "You haven't made any bookings yet."
                : `No ${filter} bookings found.`
              }
            </p>
            <div className="mt-6">
              <a
                href="/rooms"
                className="btn-primary flex items-center justify-center px-6 py-3 min-w-fit whitespace-nowrap"
              >
                <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                Book a Room
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Booking"
        message={`Are you sure you want to delete the booking "${bookingToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
};

export default Bookings;
