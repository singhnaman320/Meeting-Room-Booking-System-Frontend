import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Home, Users, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Rooms', href: '/rooms', icon: Calendar },
    { name: 'My Bookings', href: '/bookings', icon: Users },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-700 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center min-w-0 flex-1">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-sm sm:text-lg lg:text-xl font-bold text-primary-600 dark:text-primary-400 truncate">
                <span className="hidden sm:inline">Meeting Room Booking</span>
                <span className="sm:hidden">MRB</span>
              </h1>
            </div>
            {user && (
              <div className="hidden md:ml-6 md:flex md:space-x-4 lg:space-x-8">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        isActive(item.href)
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200 whitespace-nowrap`}
                    >
                      <Icon className="w-4 h-4 mr-1 lg:mr-2" />
                      <span className="hidden lg:inline">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-4 flex-shrink-0">
            <ThemeToggle />
            {user && (
              <>
                <div className="hidden sm:flex items-center space-x-2">
                  <User className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                  <span className="text-xs lg:text-sm text-gray-700 dark:text-gray-300 truncate max-w-20 lg:max-w-none">{user?.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1 lg:px-2 py-1 rounded whitespace-nowrap">
                    {user?.role}
                  </span>
                </div>
                <div className="sm:hidden flex items-center">
                  <span className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-16">{user?.name}</span>
                </div>
                <Link
                  to="/profile"
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 p-1"
                  title="Profile"
                >
                  <User className="w-4 h-4 lg:w-5 lg:h-5" />
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200 p-1"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 lg:w-5 lg:h-5" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
