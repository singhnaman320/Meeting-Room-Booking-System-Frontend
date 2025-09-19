import React, { useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Home, Users, User, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import ThemeToggle from '../ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = React.useState(false);
  const mobileMenuRef = useRef(null);
  const hamburgerButtonRef = useRef(null);
  const desktopDropdownRef = useRef(null);
  const desktopDropdownButtonRef = useRef(null);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Rooms', href: '/rooms', icon: Calendar },
    { name: 'My Bookings', href: '/bookings', icon: Users },
  ];

  const isActive = (path) => location.pathname === path;

  // Generate user initials from name
  const getUserInitials = (name) => {
    if (!name) return 'U';
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close mobile menu
      if (
        mobileMenuRef.current && 
        !mobileMenuRef.current.contains(event.target) &&
        hamburgerButtonRef.current &&
        !hamburgerButtonRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
      
      // Close desktop dropdown
      if (
        desktopDropdownRef.current && 
        !desktopDropdownRef.current.contains(event.target) &&
        desktopDropdownButtonRef.current &&
        !desktopDropdownButtonRef.current.contains(event.target)
      ) {
        setIsDesktopDropdownOpen(false);
      }
    };

    if (isMobileMenuOpen || isDesktopDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobileMenuOpen, isDesktopDropdownOpen]);

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
                {/* Desktop user dropdown */}
                <div className="hidden md:flex items-center relative">
                  <button
                    ref={desktopDropdownButtonRef}
                    onClick={() => setIsDesktopDropdownOpen(!isDesktopDropdownOpen)}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-primary-700 dark:text-primary-300">
                        {getUserInitials(user?.name)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded whitespace-nowrap">
                      Employee
                    </span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDesktopDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Desktop dropdown menu */}
                  {isDesktopDropdownOpen && (
                    <div
                      ref={desktopDropdownRef}
                      className="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setIsDesktopDropdownOpen(false)}
                        className={`${
                          isActive('/profile')
                            ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                        } flex items-center px-4 py-2 text-sm transition-colors duration-200`}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          setIsDesktopDropdownOpen(false);
                          logout();
                        }}
                        className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
                {/* Mobile user initials */}
                <div className="md:hidden flex items-center">
                  <div className="w-8 h-8 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-700 dark:text-primary-300">
                      {getUserInitials(user?.name)}
                    </span>
                  </div>
                </div>
                
                {/* Mobile menu button */}
                <button
                  ref={hamburgerButtonRef}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 transition-colors duration-200"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {user && isMobileMenuOpen && (
          <div className="md:hidden" ref={mobileMenuRef}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`${
                      isActive(item.href)
                        ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200`}
                  >
                    <div className="flex items-center">
                      <Icon className="w-5 h-5 mr-3" />
                      {item.name}
                    </div>
                  </Link>
                );
              })}
              
              {/* Profile link in mobile menu */}
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`${
                  isActive('/profile')
                    ? 'bg-primary-50 border-primary-500 text-primary-700 dark:bg-primary-900/20 dark:text-primary-300'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium transition-colors duration-200`}
              >
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-3" />
                  Profile
                </div>
              </Link>
              
              {/* Logout button in mobile menu */}
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  logout();
                }}
                className="w-full text-left block pl-3 pr-4 py-2 border-l-4 border-transparent text-gray-600 hover:bg-red-50 hover:border-red-300 hover:text-red-800 dark:text-gray-300 dark:hover:bg-red-900/20 dark:hover:text-red-400 text-base font-medium transition-colors duration-200"
              >
                <div className="flex items-center">
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
