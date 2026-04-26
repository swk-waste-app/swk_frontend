import { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FiCalendar, FiFileMinus, FiFileText, FiTrash2, FiUser } from 'react-icons/fi';
import { MdOutlinePeopleAlt } from 'react-icons/md';
import { TbRefreshAlert } from 'react-icons/tb';
import { PiSunLight } from 'react-icons/pi';
import { RiInformationLine } from 'react-icons/ri';
import { IoEllipse } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { apiDeleteScheduledTicket, apiGetUsersScheduledProducts } from '../../services/product';
import Swal from 'sweetalert2';

const StatusBadge = ({ status }) => (
  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
    status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
    status === 'Completed'   ? 'bg-green-100 text-green-700' :
    status === 'Cancelled'   ? 'bg-red-100 text-red-700' :
                               'bg-teal-100 text-teal-700'
  }`}>
    <IoEllipse size={6} />
    {status || 'N/A'}
  </span>
);

const WasteCollection = () => {
  const [tickets, setTickets] = useState([]);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await apiGetUsersScheduledProducts();
        setTickets(response.data);
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
    fetchTickets();
  }, []);

  const handleDeleteTicket = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#EF4444',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      setDeletingId(id);
      try {
        await apiDeleteScheduledTicket(id);
        setTickets(prev => prev.filter(t => t._id !== id));
        Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Schedule has been deleted.', confirmButtonColor: '#10B981', timer: 1500 });
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Oops...', text: error.message || 'Failed to delete schedule', confirmButtonColor: '#10B981' });
      } finally {
        setDeletingId(null);
      }
    }
  };

  const ActionButtons = ({ ticket }) => (
    <div className="flex items-center gap-4 text-gray-500">
      <Link to={`/customerDashboard/editSchedule/${ticket._id}`} className="hover:text-green-600 transition-colors">
        <RiInformationLine size={18} />
      </Link>
      <Link to={`/customerDashboard/schedule/${ticket._id}`} className="hover:text-blue-600 transition-colors">
        <FiFileText size={17} />
      </Link>
      <button
        onClick={() => handleDeleteTicket(ticket._id)}
        disabled={deletingId === ticket._id}
        className={`hover:text-red-500 transition-colors ${deletingId === ticket._id ? 'opacity-40 cursor-wait' : ''}`}>
        <FiTrash2 size={17} />
      </button>
    </div>
  );

  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-400">
        <FiCalendar className="text-4xl mx-auto mb-2 opacity-30" />
        <p className="font-medium text-gray-500">No scheduled pickups yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <h3 className="text-lg font-semibold px-4 pt-4 pb-3 border-b border-gray-100">Ticket Management</h3>

      {/* Mobile card layout */}
      <div className="block md:hidden divide-y divide-gray-100">
        {tickets.map((ticket) => (
          <div key={ticket._id} className="p-4 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Date</p>
                <p className="text-sm font-medium text-gray-800">
                  {new Date(ticket.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
              <StatusBadge status={ticket.status} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Location</p>
                <p className="text-sm text-gray-700 truncate">{ticket.location || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Waste Type</p>
                <p className="text-sm text-gray-700 truncate">{ticket.wasteType || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-gray-400 font-mono">#{ticket._id?.slice(-8)}</p>
              <ActionButtons ticket={ticket} />
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><FiCalendar className="text-green-500" /> Date</span>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><FiFileMinus className="text-green-500" /> ID</span>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><MdOutlinePeopleAlt className="text-green-500" /> Location</span>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><FiUser className="text-green-500" /> Assigned</span>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><PiSunLight className="text-green-500" /> Status</span>
              </th>
              <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <span className="flex items-center gap-1.5"><TbRefreshAlert className="text-green-500" /> Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-[#475467]">
            {tickets.map((ticket) => (
              <tr key={ticket._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm">
                  {new Date(ticket.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td className="px-4 py-3 text-xs font-mono text-gray-400">
                  #{ticket._id?.slice(-8)}
                </td>
                <td className="px-4 py-3 text-sm max-w-[160px] truncate">{ticket.location || 'N/A'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <FaUserCircle className="text-gray-300 text-xl flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate max-w-[100px]">
                      {ticket.agentName || 'Unassigned'}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-4 py-3">
                  <ActionButtons ticket={ticket} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WasteCollection;
