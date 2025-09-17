import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { User, Save, X, Shield, Mail, Building } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/apiService';
import ConfirmationModal from '../components/ConfirmationModal';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [originalData, setOriginalData] = useState({
    name: '',
    email: '',
    department: ''
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    department: ''
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCancel = () => {
    if (hasChanges) {
      setShowCancelConfirm(true);
    }
  };

  const confirmCancel = () => {
    setFormData(originalData);
    setHasChanges(false);
    setShowCancelConfirm(false);
    toast.info('Changes discarded');
  };

  const cancelCancel = () => {
    setShowCancelConfirm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiService.users.updateProfile(formData);
      
      // Update the user context with the new data
      updateUser(formData);
      
      setOriginalData(formData); // Update original data to reflect saved changes
      setHasChanges(false); // Reset changes flag
      toast.success('Profile updated successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || '',
        email: user.email || '',
        department: user.department || ''
      };
      setFormData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  useEffect(() => {
    // Check if form data has changed from original
    const changed = Object.keys(formData).some(
      key => formData[key] !== originalData[key]
    );
    setHasChanges(changed);
  }, [formData, originalData]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Manage your account information.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Info Card */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="text-center">
              <div className="mx-auto h-24 w-24 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
                <User className="h-12 w-12 text-primary-600 dark:text-primary-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{user?.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              <div className="mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                  <Shield className="w-4 h-4 mr-1" />
                  Employee
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="lg:col-span-2">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Edit Profile</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Mail className="inline w-4 h-4 mr-1" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={user?.email}
                  disabled
                  className="input-field bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Shield className="inline w-4 h-4 mr-1" />
                  Role
                </label>
                <input
                  type="text"
                  value="Employee"
                  disabled
                  className="input-field bg-gray-50 dark:bg-gray-700 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  All users have employee access.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading || !hasChanges}
                  className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !hasChanges}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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

        {/* Cancel Confirmation Modal */}
        <ConfirmationModal
          isOpen={showCancelConfirm}
          onClose={cancelCancel}
          onConfirm={confirmCancel}
          title="Discard Changes"
          message="Are you sure you want to discard your changes? This action cannot be undone."
          confirmText="Discard"
          cancelText="Keep Editing"
          type="warning"
        />
      </div>
    </div>
  );
};

export default Profile;
