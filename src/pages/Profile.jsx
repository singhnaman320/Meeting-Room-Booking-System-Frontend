import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Building, Shield, Save } from 'lucide-react';
import apiService from '../services/apiService';

const Profile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiService.users.updateProfile(formData);
      toast.success('Profile updated successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        <p className="mt-2 text-gray-600">Manage your account information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="text-center">
              <div className="mx-auto h-24 w-24 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-primary-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <div className="mt-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  user?.role === 'admin' 
                    ? 'bg-purple-100 text-purple-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  <Shield className="w-4 h-4 mr-1" />
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Edit Profile</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline w-4 h-4 mr-1" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="input-field"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="input-field bg-gray-50 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email cannot be changed. Contact administrator if needed.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building className="inline w-4 h-4 mr-1" />
                  Department
                </label>
                <input
                  type="text"
                  name="department"
                  required
                  className="input-field"
                  value={formData.department}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Shield className="inline w-4 h-4 mr-1" />
                  Role
                </label>
                <input
                  type="text"
                  value={user?.role}
                  disabled
                  className="input-field bg-gray-50 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Role is managed by administrators.
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
