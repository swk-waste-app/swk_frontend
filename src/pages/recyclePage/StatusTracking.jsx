import { useState, useEffect } from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { FiTrendingUp, FiCheckCircle, FiPackage } from 'react-icons/fi';
import { apiGetUsersScheduledProducts } from '../../services/product';

const StatBox = ({ title, value, percentage, icon, color }) => (
  <div className={`${color} rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1`}>
    <div className="flex justify-between items-start">
      <div>
        <h3 className="text-gray-100 text-sm font-medium mb-2">{title}</h3>
        <div className="text-white text-3xl font-bold mb-2">{value}</div>
        <div className="flex items-center gap-1 text-sm">
          <span className={`flex items-center ${percentage >= 0 ? 'text-green-300' : 'text-red-300'}`}>
            {percentage >= 0 ? (
              <FaArrowUp className="mr-1" />
            ) : (
              <FaArrowDown className="mr-1" />
            )}
            {Math.abs(percentage)}%
          </span>
          <span className="text-gray-200">vs last month</span>
        </div>
      </div>
      <div className="p-3 bg-white/10 rounded-lg">
        {icon}
      </div>
    </div>
  </div>
);

const DashboardStats = () => {
  const [ticketStats, setTicketStats] = useState({
    totalTickets: 0,
    completedTickets: 0,
    pendingTickets: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiGetUsersScheduledProducts();
        const tickets = response.data || [];
        
        // Calculate stats from tickets array
        const totalTickets = tickets.length;
        const completedTickets = tickets.filter(ticket => 
          ticket.status === 'completed'
        ).length;
        const pendingTickets = tickets.filter(ticket => 
          ticket.status === 'pending' || ticket.status === 'in progress'
        ).length;

        setTicketStats({
          totalTickets,
          completedTickets,
          pendingTickets
        });
      } catch (error) {
        console.error('Error fetching ticket stats:', error);
      }
    };

    fetchStats();
  }, []);

  // Calculate points (20 per completed ticket)
  const totalPoints = ticketStats.completedTickets * 20;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatBox
          title="Total Tickets"
          value={ticketStats.totalTickets}
          percentage={10}
          icon={<FiPackage size={24} className="text-white" />}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <StatBox
          title="Completed Tickets"
          value={ticketStats.completedTickets}
          percentage={5}
          icon={<FiCheckCircle size={24} className="text-white" />}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
        <StatBox
          title="Total Points"
          value={totalPoints}
          percentage={5}
          icon={<FiTrendingUp size={24} className="text-white" />}
          color="bg-gradient-to-r from-green-500 to-green-600"
        />
      </div>
      
      {/* Summary section */}
      <div className="mt-8 p-6 bg-white rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Summary</h3>
        <div className="text-gray-600 space-y-2">
          <p>
            Total waste collection tickets: <span className="font-medium text-gray-800">{ticketStats.totalTickets}</span>
          </p>
          {/* <p>
            Completed collections: <span className="font-medium text-gray-800">{ticketStats.completedTickets}</span>
          </p>
          <p>
            Pending/In Progress: <span className="font-medium text-gray-800">{ticketStats.pendingTickets}</span>
          </p> */}
          <p className="text-green-600 font-medium">
            Total points earned: {totalPoints} points
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
