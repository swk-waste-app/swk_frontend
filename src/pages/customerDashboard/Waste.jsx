import React, { useState, useEffect } from 'react';
import WasteCollectionList from '../customerDashboard/wasteList';
import WasteSchedulePage from '../customerDashboard/DatePicker';
import { apiGetUserStats } from '../../services/product';
import { FaCalendarCheck, FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';

const WasteSection = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiGetUserStats();
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6 p-4 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Waste Collection</h1>
          <p className="text-gray-500 text-sm mt-1">Schedule and track your waste pickups</p>
        </div>
        <WasteSchedulePage />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Total</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats?.stats?.totalPickups || 0}</h3>
              <p className="text-xs text-blue-600 mt-1">All pickups</p>
            </div>
            <FaCalendarCheck className="text-blue-500 text-2xl opacity-80" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Completed</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats?.stats?.completedPickups || 0}</h3>
              <p className="text-xs text-green-600 mt-1">Successfully done</p>
            </div>
            <FaCheckCircle className="text-green-500 text-2xl opacity-80" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Scheduled</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats?.stats?.scheduledPickups || 0}</h3>
              <p className="text-xs text-yellow-600 mt-1">Upcoming</p>
            </div>
            <FaClock className="text-yellow-500 text-2xl opacity-80" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Cancelled</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats?.stats?.cancelledPickups || 0}</h3>
              <p className="text-xs text-red-600 mt-1">Not completed</p>
            </div>
            <FaTimesCircle className="text-red-500 text-2xl opacity-80" />
          </div>
        </div>
      </div>

      {/* Waste Collection List */}
      <WasteCollectionList />
    </div>
  );
};

export default WasteSection;