/**
 * Mobile Navigation Component
 *
 * Slide-out navigation menu for mobile devices.
 */

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { X, LayoutDashboard, Users, Settings, BarChart3, LogOut, BookOpen } from 'lucide-react';

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/projects', label: 'Projekt', icon: Users },
    { path: '/statistics', label: 'Statistik', icon: BarChart3 },
    { path: '/documentation', label: 'Dokumentation', icon: BookOpen },
    { path: '/settings', label: 'Inställningar', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLinkClick = () => {
    onClose();
  };

  const handleLogout = () => {
    onClose();
    logout();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Slide-out menu */}
      <div className="fixed top-0 left-0 bottom-0 w-72 bg-white shadow-xl z-50 md:hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Visitor Tracker</span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            aria-label="Stäng meny"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600">
                    {user.name?.charAt(0) || '?'}
                  </span>
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation links */}
        <nav className="p-4">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition
                    ${isActive(link.path)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout button */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logga ut
          </button>
        </div>
      </div>
    </>
  );
}
