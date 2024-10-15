import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Settings, Eye, BarChart2, Users, Building, CreditCard, DollarSign } from 'lucide-react';
import api from '../utils/api';

interface FranchiseStats {
  totalFranchises: number;
  activeFranchises: number;
  totalRevenue: number;
}

const SuperAdminDashboard: React.FC = () => {
  const { user, setViewMode } = useAuth();
  const navigate = useNavigate();
  const [currentViewMode, setCurrentViewMode] = useState('superadmin');
  const [franchiseStats, setFranchiseStats] = useState<FranchiseStats | null>(null);

  useEffect(() => {
    fetchFranchiseStats();
  }, []);

  const fetchFranchiseStats = async () => {
    try {
      const response = await api.get('/franchises/stats');
      setFranchiseStats(response.data);
    } catch (error) {
      console.error('Error fetching franchise stats:', error);
    }
  };

  const handleViewModeChange = (mode: string) => {
    setCurrentViewMode(mode);
    setViewMode(mode);
  };

  if (user?.role !== 'superadmin') {
    return <div>Access denied. Super admin rights required.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Super Admin Dashboard</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">View Mode</h2>
        <div className="flex space-x-4">
          {['superadmin', 'admin', 'manager', 'staff'].map((mode) => (
            <button
              key={mode}
              onClick={() => handleViewModeChange(mode)}
              className={`px-4 py-2 rounded-md ${
                currentViewMode === mode
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {franchiseStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Franchises"
            value={franchiseStats.totalFranchises}
            icon={Building}
          />
          <StatCard
            title="Active Franchises"
            value={franchiseStats.activeFranchises}
            icon={Users}
          />
          <StatCard
            title="Total Revenue"
            value={`$${franchiseStats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Franchise Management"
          icon={Building}
          onClick={() => navigate('/franchises')}
        />
        <DashboardCard
          title="Global User Management"
          icon={Users}
          onClick={() => navigate('/global-users')}
        />
        <DashboardCard
          title="Subscription Plans"
          icon={CreditCard}
          onClick={() => navigate('/subscription-plans')}
        />
        <DashboardCard
          title="System Settings"
          icon={Settings}
          onClick={() => navigate('/system-settings')}
        />
        <DashboardCard
          title="Analytics"
          icon={BarChart2}
          onClick={() => navigate('/analytics')}
        />
        <DashboardCard
          title="Audit Logs"
          icon={Eye}
          onClick={() => navigate('/audit-logs')}
        />
      </div>
    </div>
  );
};

interface DashboardCardProps {
  title: string;
  icon: React.ElementType;
  onClick: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, icon: Icon, onClick }) => (
  <div
    className="bg-white p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-200"
    onClick={onClick}
  >
    <Icon className="w-12 h-12 mb-4 text-blue-500" />
    <h3 className="text-lg font-semibold">{title}</h3>
  </div>
);

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
      </div>
      <Icon className="w-12 h-12 text-blue-500" />
    </div>
  </div>
);

export default SuperAdminDashboard;