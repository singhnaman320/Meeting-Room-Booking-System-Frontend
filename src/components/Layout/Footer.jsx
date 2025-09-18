import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Home, Users, User, MapPin, Clock, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Footer = () => {
  const { user } = useAuth();
  const location = useLocation();

  const quickLinks = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Browse Rooms', href: '/rooms' },
    { name: 'My Bookings', href: '/bookings' },
    { name: 'Profile', href: '/profile' },
  ];

  const features = [
    { name: 'Real-time Booking', icon: Clock },
    { name: 'Room Management', icon: MapPin },
    { name: 'Secure Access', icon: Shield },
  ];

  // Don't show footer on login/register pages
  if (!user || location.pathname === '/login' || location.pathname === '/register') {
    return null;
  }

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t-2 border-primary-200 dark:border-primary-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 lg:py-12">
          
          {/* Main Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary-600 dark:bg-primary-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Meeting Room Booking
                  </h3>
                  <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                    Smart Workspace Management
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                Streamline your workspace with our efficient meeting room booking system. 
                Book rooms, manage schedules, and collaborate seamlessly.
              </p>
              
              {/* Features */}
              <div className="flex flex-wrap gap-4">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.name} className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <Icon className="w-3 h-3" />
                      <span>{feature.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm transition-colors duration-200 block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* System Info */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
                System
              </h4>
              <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>System Online</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Version:</span>
                  <span className="ml-1 font-mono text-xs">v1.0.0</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Built with:</span>
                  <span className="ml-1">MERN Stack</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="text-center sm:text-left">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  © 2025 Meeting Room Booking System. All rights reserved.
                </p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Developed by <span className="font-medium text-primary-600 dark:text-primary-400">Naman Kumar Singh</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
