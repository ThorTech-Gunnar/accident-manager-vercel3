import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AlertCircle, LogOut, User, FileText, BarChart2, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import GlobalSearch from './GlobalSearch';
import NotificationDropdown from './NotificationDropdown';

const Navbar: React.FC = () => {
  const { user, logout, viewMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <AlertCircle className="h-8 w-8 text-blue-600" />
              <span className="ml-2 font-bold text-xl text-gray-900">Incident Manager</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <NavLink to="/dashboard" icon={BarChart2} isActive={isActive('/dashboard')}>Dashboard</NavLink>
              <NavLink to="/cases" icon={FileText} isActive={isActive('/cases')}>Cases</NavLink>
              {(viewMode === 'admin' || viewMode === 'superadmin') && (
                <>
                  <NavLink to="/users" icon={User} isActive={isActive('/users')}>Users</NavLink>
                  <NavLink to="/floor-plans" icon={Settings} isActive={isActive('/floor-plans')}>Floor Plans</NavLink>
                </>
              )}
              {viewMode === 'superadmin' && (
                <NavLink to="/franchises" icon={Settings} isActive={isActive('/franchises')}>Franchises</NavLink>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <GlobalSearch />
            </div>
            <NotificationDropdown />
            <div className="ml-3 relative">
              <span className="mr-4 text-sm font-medium text-gray-500">
                View Mode: {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)}
              </span>
              <button
                onClick={handleLogout}
                className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ to: string; icon: React.ElementType; isActive: boolean; children: React.ReactNode }> = ({ to, icon: Icon, isActive, children }) => (
  <Link
    to={to}
    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
      isActive
        ? 'border-blue-500 text-gray-900'
        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
    }`}
  >
    <Icon className="mr-2 h-5 w-5" />
    {children}
  </Link>
);

export default Navbar;