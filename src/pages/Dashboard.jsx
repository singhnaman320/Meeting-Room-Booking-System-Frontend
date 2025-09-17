import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, MapPin, Plus } from 'lucide-react';
import { format, isToday, isTomorrow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/apiService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRooms: 0,
    todayBookings: 0,
    upcomingBookings: 0,
    myBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [roomsRes, bookingsRes, myBookingsRes] = await Promise.all([
        apiService.rooms.getAll(),
        apiService.bookings.getAll(),
        apiService.bookings.getMyBookings()
      ]);

      const rooms = roomsRes.data;
      const allBookings = bookingsRes.data;
      const myBookings = myBookingsRes.data;

      const today = new Date();
      const todayBookings = allBookings.filter(booking => 
        isToday(new Date(booking.startTime)) && booking.status === 'active'
      );

      const upcomingBookings = myBookings.filter(booking => 
        new Date(booking.startTime) > today && booking.status === 'active'
      );

      setStats({
        totalRooms: rooms.length,
        todayBookings: todayBookings.length,
        upcomingBookings: upcomingBookings.length,
        myBookings: myBookings.filter(b => b.status === 'active').length
      });

      setRecentBookings(myBookings.slice(0, 5));
      setAvailableRooms(rooms.slice(0, 4));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleBookRoom = (room) => {
    // Navigate to rooms page with the specific room pre-selected
    navigate('/rooms', { state: { selectedRoomId: room._id } });
  };

  const getBookingTimeText = (startTime) => {
    const date = new Date(startTime);
    if (isToday(date)) {
      return `Today at ${format(date, 'HH:mm')}`;
    } else if (isTomorrow(date)) {
      return `Tomorrow at ${format(date, 'HH:mm')}`;
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <MapPin className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Rooms</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalRooms}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Today's Bookings</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.todayBookings}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.upcomingBookings}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">My Bookings</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.myBookings}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h2>
            <a href="/bookings" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
              View all
            </a>
          </div>
          <div className="space-y-4">
            {recentBookings.length > 0 ? (
              recentBookings.map((booking) => (
                <div key={booking._id} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className={`w-3 h-3 rounded-full ${
                      booking.status === 'active' ? 'bg-green-400' : 
                      booking.status === 'cancelled' ? 'bg-red-400' : 'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {booking.title}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {booking.room?.name} • {getBookingTimeText(booking.startTime)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">No recent bookings</p>
            )}
          </div>
        </div>

        {/* Available Rooms */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Available Rooms</h2>
            <a href="/rooms" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 text-sm font-medium">
              View all
            </a>
          </div>
          <div className="space-y-4">
            {availableRooms.map((room) => (
              <div key={room._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{room.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    {room.location} • Capacity: {room.capacity}
                  </p>
                </div>
                <button 
                  onClick={() => handleBookRoom(room)}
                  className="btn-primary text-xs py-1 px-2 flex items-center"
                  title="Go to rooms page to book this room"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Book
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <a
              href="/rooms"
              className="flex items-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors duration-200"
            >
              <Calendar className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-3" />
              <div>
                <p className="font-medium text-primary-900 dark:text-primary-100">Book a Room</p>
                <p className="text-sm text-primary-600 dark:text-primary-400">Find and reserve meeting rooms</p>
              </div>
            </a>
            <a
              href="/bookings"
              className="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
            >
              <Users className="h-8 w-8 text-green-600 dark:text-green-400 mr-3" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">My Bookings</p>
                <p className="text-sm text-green-600 dark:text-green-400">Manage your reservations</p>
              </div>
            </a>
            <a
              href="/profile"
              className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200"
            >
              <Users className="h-8 w-8 text-purple-600 dark:text-purple-400 mr-3" />
              <div>
                <p className="font-medium text-purple-900 dark:text-purple-100">Profile</p>
                <p className="text-sm text-purple-600 dark:text-purple-400">Update your information</p>
              </div>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
