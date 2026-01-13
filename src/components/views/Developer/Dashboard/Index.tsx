'use client';

import React from 'react';
import { FaFolderOpen, FaCode, FaExclamationTriangle, FaCheckCircle, FaArrowUp, FaArrowDown } from 'react-icons/fa';

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

const DeveloperDashboard: React.FC = () => {
  const stats = [
    {
      title: 'Active Projects',
      value: '12',
      change: 20.0,
      icon: <FaFolderOpen className="w-6 h-6 text-purple-600" />,
      color: 'bg-purple-100',
    },
    {
      title: 'Commits Today',
      value: '47',
      change: 15.3,
      icon: <FaCode className="w-6 h-6 text-blue-600" />,
      color: 'bg-blue-100',
    },
    {
      title: 'Open Issues',
      value: '23',
      change: -8.5,
      icon: <FaExclamationTriangle className="w-6 h-6 text-orange-600" />,
      color: 'bg-orange-100',
    },
    {
      title: 'Code Reviews',
      value: '8',
      change: 12.1,
      icon: <FaCheckCircle className="w-6 h-6 text-green-600" />,
      color: 'bg-green-100',
    },
  ];

  const recentProjects = [
    {
      id: 1,
      name: 'E-Commerce Platform',
      status: 'In Progress',
      progress: 75,
      color: 'bg-blue-500',
    },
    {
      id: 2,
      name: 'Mobile Banking App',
      status: 'Review',
      progress: 90,
      color: 'bg-purple-500',
    },
    {
      id: 3,
      name: 'Analytics Dashboard',
      status: 'In Progress',
      progress: 45,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Developer Dashboard</h1>
        <p className="text-gray-600 mt-1">Track your projects and development activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Recent Projects */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Projects</h2>
        <div className="space-y-4">
          {recentProjects.map((project) => (
            <div key={project.id} className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:shadow-sm transition-all duration-200">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <span className="inline-flex items-center mt-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    {project.status}
                  </span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{project.progress}%</span>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${project.color}`}
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
