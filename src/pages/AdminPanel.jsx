import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Users, MapPin, Settings, Calendar } from 'lucide-react';
import apiService from '../services/apiService';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('rooms');
  const [rooms, setRooms] = useState([]);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);

  const [roomForm, setRoomForm] = useState({
    name: '',
    capacity: '',
    location: '',
    amenities: [],
    description: ''
  });

  const amenityOptions = [
    'projector', 'whiteboard', 'video_conference', 'audio_system', 'wifi', 'air_conditioning'
  ];

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (activeTab === 'rooms') {
        const response = await apiService.rooms.getAll();
        setRooms(response.data);
      } else if (activeTab === 'users') {
        const response = await apiService.users.getAll();
        setUsers(response.data);
      } else if (activeTab === 'bookings') {
        const response = await apiService.bookings.getAll();
        setBookings(response.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoom) {
        await apiService.rooms.update(editingRoom._id, roomForm);
        toast.success('Room updated successfully');
      } else {
        await apiService.rooms.create(roomForm);
        toast.success('Room created successfully');
      }
      setShowRoomModal(false);
      setEditingRoom(null);
      setRoomForm({ name: '', capacity: '', location: '', amenities: [], description: '' });
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save room';
      toast.error(message);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;
    
    try {
      await apiService.rooms.delete(roomId);
      toast.success('Room deleted successfully');
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete room';
      toast.error(message);
    }
  };

  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({
      name: room.name,
      capacity: room.capacity.toString(),
      location: room.location,
      amenities: room.amenities,
      description: room.description || ''
    });
    setShowRoomModal(true);
  };

  const handleAmenityChange = (amenity) => {
    setRoomForm(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleUserRoleChange = async (userId, newRole) => {
    try {
      await apiService.users.updateRole(userId, { role: newRole });
      toast.success('User role updated successfully');
      fetchData();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update user role';
      toast.error(message);
    }
  };

  const tabs = [
    { key: 'rooms', label: 'Rooms', icon: MapPin },
    { key: 'users', label: 'Users', icon: Users },
    { key: 'bookings', label: 'Bookings', icon: Calendar }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="mt-2 text-gray-600">Manage rooms, users, and bookings.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <>
          {/* Rooms Tab */}
          {activeTab === 'rooms' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Manage Rooms</h2>
                <button
                  onClick={() => setShowRoomModal(true)}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Room
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div key={room._id} className="card">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{room.name}</h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditRoom(room)}
                          className="text-primary-600 hover:text-primary-700"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><MapPin className="inline w-4 h-4 mr-1" />{room.location}</p>
                      <p><Users className="inline w-4 h-4 mr-1" />Capacity: {room.capacity}</p>
                      <p>Status: <span className={room.isAvailable ? 'text-green-600' : 'text-red-600'}>
                        {room.isAvailable ? 'Available' : 'Unavailable'}
                      </span></p>
                    </div>
                    {room.amenities.length > 0 && (
                      <div className="mt-3">
                        <div className="flex flex-wrap gap-1">
                          {room.amenities.map((amenity) => (
                            <span key={amenity} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {amenity.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Manage Users</h2>
              <div className="card overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <select
                            value={user.role}
                            onChange={(e) => handleUserRoleChange(user._id, e.target.value)}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="employee">Employee</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Bookings Tab */}
          {activeTab === 'bookings' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">All Bookings</h2>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="card">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{booking.title}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2 text-sm text-gray-600">
                          <p><Users className="inline w-4 h-4 mr-1" />{booking.user?.name}</p>
                          <p><MapPin className="inline w-4 h-4 mr-1" />{booking.room?.name}</p>
                          <p><Calendar className="inline w-4 h-4 mr-1" />
                            {new Date(booking.startTime).toLocaleDateString()}
                          </p>
                          <p>Status: <span className={`font-medium ${
                            booking.status === 'active' ? 'text-green-600' : 
                            booking.status === 'cancelled' ? 'text-red-600' : 'text-gray-600'
                          }`}>{booking.status}</span></p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Room Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingRoom ? 'Edit Room' : 'Add New Room'}
              </h2>
              <button
                onClick={() => {
                  setShowRoomModal(false);
                  setEditingRoom(null);
                  setRoomForm({ name: '', capacity: '', location: '', amenities: [], description: '' });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleRoomSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Name</label>
                <input
                  type="text"
                  required
                  className="input-field"
                  value={roomForm.name}
                  onChange={(e) => setRoomForm({...roomForm, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="input-field"
                    value={roomForm.capacity}
                    onChange={(e) => setRoomForm({...roomForm, capacity: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    value={roomForm.location}
                    onChange={(e) => setRoomForm({...roomForm, location: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="grid grid-cols-2 gap-2">
                  {amenityOptions.map((amenity) => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={roomForm.amenities.includes(amenity)}
                        onChange={() => handleAmenityChange(amenity)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {amenity.replace('_', ' ')}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  className="input-field"
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({...roomForm, description: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setShowRoomModal(false);
                    setEditingRoom(null);
                    setRoomForm({ name: '', capacity: '', location: '', amenities: [], description: '' });
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingRoom ? 'Update Room' : 'Create Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
