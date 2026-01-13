'use client';

import React from 'react';
import { FaUsers, FaFolderOpen, FaDollarSign, FaTicketAlt, FaArrowUp, FaArrowDown, FaPlus, FaEdit, FaTrash, FaComment } from 'react-icons/fa';

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon, color }) => {
  const isPositive = change >= 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>
          {icon}
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          {isPositive ? <FaArrowUp className="w-3 h-3" /> : <FaArrowDown className="w-3 h-3" />}
          {Math.abs(change)}%
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Total Users',
      value: '2,543',
      change: 12.5,
      icon: <FaUsers className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-100',
    },
    {
      title: 'Active Projects',
      value: '156',
      change: 8.2,
      icon: <FaFolderOpen className="w-6 h-6 text-green-600" />,
      color: 'bg-green-100',
    },
    {
      title: 'Revenue',
      value: '$45,231',
      change: 15.3,
      icon: <FaDollarSign className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-100',
    },
    {
      title: 'Support Tickets',
      value: '89',
      change: -3.1,
      icon: <FaTicketAlt className="w-6 h-6 text-orange-600" />,
      color: 'bg-orange-100',
    },
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'created a new project', time: '2 minutes ago', type: 'create' },
    { id: 2, user: 'Jane Smith', action: 'updated user profile', time: '15 minutes ago', type: 'update' },
    { id: 3, user: 'Mike Johnson', action: 'deleted a task', time: '1 hour ago', type: 'delete' },
    { id: 4, user: 'Sarah Williams', action: 'commented on issue #234', time: '2 hours ago', type: 'comment' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create':
        return <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
          <FaPlus className="w-4 h-4" />
        </div>;
      case 'update':
        return <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
          <FaEdit className="w-4 h-4" />
        </div>;
      case 'delete':
        return <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600">
          <FaTrash className="w-4 h-4" />
        </div>;
      default:
        return <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
          <FaComment className="w-4 h-4" />
        </div>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
              {getActivityIcon(activity.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  <span className="font-medium">{activity.user}</span>{' '}
                  <span className="text-gray-600">{activity.action}</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
