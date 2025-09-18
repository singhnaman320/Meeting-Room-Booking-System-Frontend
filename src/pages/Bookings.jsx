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
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    attendees: ''
  });
  const [editLoading, setEditLoading] = useState(false);

  // Convert date to local datetime-local format
  const formatDateTimeLocal = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

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

  const handleCancelClick = (booking) => {
    setBookingToCancel(booking);
    setShowCancelModal(true);
  };

  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return;

    try {
      await apiService.bookings.cancel(bookingToCancel._id);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to cancel booking';
      toast.error(message);
    } finally {
      setShowCancelModal(false);
      setBookingToCancel(null);
    }
  };

  const handleCancelCancel = () => {
    setShowCancelModal(false);
    setBookingToCancel(null);
  };

  const handleDeleteClick = (booking) => {
    setBookingToDelete(booking);
    setShowDeleteModal(true);
  };

  const handleEditClick = (booking) => {
    setSelectedBooking(booking);
    setEditForm({
      title: booking.title,
      description: booking.description || '',
      startTime: formatDateTimeLocal(booking.startTime),
      endTime: formatDateTimeLocal(booking.endTime),
      attendees: booking.attendees?.toString() || ''
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setEditLoading(true);
    try {
      const updateData = {
        title: editForm.title,
        description: editForm.description,
        startTime: new Date(editForm.startTime).toISOString(),
        endTime: new Date(editForm.endTime).toISOString(),
        attendees: parseInt(editForm.attendees) || 1
      };

      await apiService.bookings.update(selectedBooking._id, updateData);
      toast.success('Booking updated successfully');
      setShowEditModal(false);
      setSelectedBooking(null);
      fetchBookings();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update booking';
      toast.error(message);
    } finally {
      setEditLoading(false);
    }
  };

  const handleEditCancel = () => {
    setShowEditModal(false);
    setSelectedBooking(null);
    setEditForm({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      attendees: ''
    });
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
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={() => handleEditClick(booking)}
                        className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 hover:bg-blue-200 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-400 rounded-md transition-colors duration-200 flex items-center whitespace-nowrap"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleCancelClick(booking)}
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

      {/* Cancel Booking Confirmation Modal */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={handleCancelCancel}
        onConfirm={handleCancelConfirm}
        title="Cancel Booking"
        message={`Are you sure you want to cancel the booking "${bookingToCancel?.title}"? This action cannot be undone.`}
        confirmText="Cancel Booking"
        cancelText="Keep Booking"
        type="warning"
      />

      {/* Edit Booking Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Edit Booking
              </h2>
              <button
                onClick={handleEditCancel}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {/* Room Info (Read-only) */}
              <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  {selectedBooking?.room?.name}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {selectedBooking?.room?.location}
                </p>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meeting Title *
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  required
                  disabled={editLoading}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm resize-none"
                  disabled={editLoading}
                />
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={editForm.startTime}
                    onChange={(e) => setEditForm(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    required
                    disabled={editLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={editForm.endTime}
                    onChange={(e) => setEditForm(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                    required
                    disabled={editLoading}
                  />
                </div>
              </div>

              {/* Attendees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Number of Attendees
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedBooking?.room?.capacity || 50}
                  value={editForm.attendees}
                  onChange={(e) => setEditForm(prev => ({ ...prev, attendees: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  disabled={editLoading}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Room capacity: {selectedBooking?.room?.capacity} people
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleEditCancel}
                  disabled={editLoading}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editLoading || !editForm.title || !editForm.startTime || !editForm.endTime}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center"
                >
                  {editLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    'Update Booking'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
