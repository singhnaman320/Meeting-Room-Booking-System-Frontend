import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { MapPin, Users, Calendar, Clock, Wifi, Monitor, Volume2, Wind } from 'lucide-react';
import BookingModal from '../components/BookingModal';
import apiService from '../services/apiService';

const Rooms = () => {
  const location = useLocation();
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filters, setFilters] = useState({
    capacity: '',
    location: '',
    amenities: []
  });

  const amenityIcons = {
    wifi: Wifi,
    projector: Monitor,
    audio_system: Volume2,
    whiteboard: Calendar,
    video_conference: Monitor
  };

  const locationOptions = [
    'Floor 1 - Wing A',
    'Floor 1 - Wing B', 
    'Floor 1 - Training Center',
    'Floor 2 - Wing A',
    'Floor 2 - Wing B',
    'Floor 3 - Executive Wing',
    'Floor 3 - Conference Center',
    'Ground Floor - Reception'
  ];

  useEffect(() => {
    fetchRooms();
  }, []);

  // Handle pre-selected room from Dashboard navigation
  useEffect(() => {
    if (location.state?.selectedRoomId && rooms.length > 0) {
      const preSelectedRoom = rooms.find(room => room._id === location.state.selectedRoomId);
      if (preSelectedRoom) {
        handleBookRoom(preSelectedRoom);
        // Clear the state to prevent reopening on subsequent visits
        window.history.replaceState({}, document.title);
      }
    }
  }, [rooms, location.state]);

  useEffect(() => {
    applyFilters();
  }, [rooms, filters]);

  const fetchRooms = async () => {
    try {
      const response = await apiService.rooms.getAll();
      setRooms(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      toast.error('Failed to fetch rooms');
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = rooms;

    if (filters.capacity) {
      filtered = filtered.filter(room => room.capacity >= parseInt(filters.capacity));
    }

    if (filters.location) {
      filtered = filtered.filter(room => 
        room.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.amenities.length > 0) {
      filtered = filtered.filter(room =>
        filters.amenities.every(amenity => room.amenities.includes(amenity))
      );
    }

    setFilteredRooms(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleAmenityFilter = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleBookRoom = (room) => {
    setSelectedRoom(room);
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    setSelectedRoom(null);
    // Toast notification is handled in BookingModal component
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Meeting Rooms</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Find and book the perfect room for your meeting.</p>
      </div>

      {/* Filters */}
      <div className="card mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Capacity
            </label>
            <input
              type="number"
              className="input-field"
              placeholder="Enter capacity"
              value={filters.capacity}
              onChange={(e) => handleFilterChange('capacity', e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="inline w-4 h-4 mr-1" />
              Location
            </label>
            <select
              className="input-field"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="">All locations</option>
              {locationOptions.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Amenities
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(amenityIcons).map((amenity) => {
                const Icon = amenityIcons[amenity];
                const isSelected = filters.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    onClick={() => handleAmenityFilter(amenity)}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                      isSelected
                        ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-300 dark:border-primary-600'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{amenity.replace('_', ' ')}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => (
          <div key={room._id} className="room-card hover:shadow-lg transition-shadow duration-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate pr-2">{room.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                room.isAvailable
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {room.isAvailable ? 'Available' : 'Unavailable'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm truncate">{room.location}</span>
              </div>
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="text-sm">Capacity: {room.capacity} people</span>
              </div>
            </div>

            <div className="room-description mb-4">
              {room.description && (
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2" title={room.description}>
                  {room.description}
                </p>
              )}
            </div>

            <div className="room-amenities mb-6">
              {room.amenities.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.slice(0, 4).map((amenity) => {
                      const Icon = amenityIcons[amenity] || Calendar;
                      return (
                        <div
                          key={amenity}
                          className="flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-xs text-gray-700 dark:text-gray-300"
                        >
                          <Icon className="w-3 h-3 mr-1 flex-shrink-0" />
                          <span className="truncate">{amenity.replace('_', ' ')}</span>
                        </div>
                      );
                    })}
                    {room.amenities.length > 4 && (
                      <div className="flex items-center px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-xs text-gray-600 dark:text-gray-400">
                        +{room.amenities.length - 4} more
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-auto">
              <button
                onClick={() => handleBookRoom(room)}
                disabled={!room.isAvailable}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Book Room
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No rooms found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your filters to find available rooms.
          </p>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedRoom && (
        <BookingModal
          room={selectedRoom}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default Rooms;
