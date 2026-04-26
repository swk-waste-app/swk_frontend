import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { FaTrash, FaEye, FaCalendarAlt, FaMapMarkerAlt, FaRecycle, FaSearch } from 'react-icons/fa';
import { apiDeleteScheduledTicket, apiGetUsersScheduledProducts } from '../../services/product';

const STATUS_COLORS = {
    'Scheduled': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
    'In Progress': { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    'Completed': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    'Cancelled': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

const WASTE_TYPE_EMOJI = {
    'General Waste': '🗑️',
    'Recyclable Materials': '♻️',
    'Organic/Food Waste': '🌿',
    'Electronic (E-Waste)': '💻',
    'Hazardous Waste': '⚠️',
    'Fashion & Textiles': '👗',
    'Plastics': '🧴',
    'Metals & Scrap': '🔩',
    'Glass': '🍶',
    'Wood & Furniture': '🪵',
    'Paper & Cardboard': '📄',
    'Rubber': '⚫',
    'Other': '📦',
};

const WasteCollectionList = () => {
    const [tickets, setTickets] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [deletingId, setDeletingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    useEffect(() => {
        fetchTickets();
    }, []);

    useEffect(() => {
        let result = tickets;
        if (search) {
            result = result.filter(t =>
                t.location?.toLowerCase().includes(search.toLowerCase()) ||
                t.wasteType?.toLowerCase().includes(search.toLowerCase())
            );
        }
        if (statusFilter !== 'All') {
            result = result.filter(t => t.status === statusFilter);
        }
        setFiltered(result);
    }, [tickets, search, statusFilter]);

    const fetchTickets = async () => {
        try {
            const response = await apiGetUsersScheduledProducts();
            if (response.data && Array.isArray(response.data)) {
                setTickets(response.data);
            }
        } catch (error) {
            console.error("Error fetching tickets:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'Delete this pickup?',
            text: "This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'Yes, delete it',
            cancelButtonText: 'Cancel',
        });

        if (result.isConfirmed) {
            setDeletingId(id);
            try {
                await apiDeleteScheduledTicket(id);
                setTickets(prev => prev.filter(t => t._id !== id));
                Swal.fire({ icon: 'success', title: 'Deleted!', timer: 1500, showConfirmButton: false });
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'Failed to delete', text: error.message });
            } finally {
                setDeletingId(null);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800">My Pickup Schedules</h3>
                        <p className="text-sm text-gray-500 mt-1">{tickets.length} total schedules</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        {/* Search */}
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
                            <input
                                type="text"
                                placeholder="Search location..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700 w-full sm:w-48"
                            />
                        </div>
                        {/* Filter */}
                        <select
                            value={statusFilter}
                            onChange={e => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                        >
                            <option value="All">All Status</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                    <FaRecycle className="text-5xl mx-auto mb-3 opacity-20" />
                    <p className="font-medium text-gray-500">No pickups found</p>
                    <p className="text-sm mt-1">
                        {tickets.length === 0 ? 'Schedule your first waste pickup to get started!' : 'Try adjusting your search or filter.'}
                    </p>
                </div>
            ) : (
                <>
                    {/* Mobile Cards */}
                    <div className="block lg:hidden p-4 space-y-4">
                        {filtered.map((ticket) => {
                            const statusStyle = STATUS_COLORS[ticket.status] || STATUS_COLORS['Scheduled'];
                            return (
                                <div key={ticket._id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{WASTE_TYPE_EMOJI[ticket.wasteType] || '🗑️'}</span>
                                            <div>
                                                <p className="font-medium text-gray-800 text-sm">{ticket.wasteType || 'General'}</p>
                                                <p className="text-xs text-gray-500">{ticket._id?.slice(-8)}</p>
                                            </div>
                                        </div>
                                        <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt className="text-green-500 text-xs" />
                                            <span>{new Date(ticket.pickupDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FaMapMarkerAlt className="text-green-500 text-xs" />
                                            <span>{ticket.location}</span>
                                        </div>
                                        {ticket.estimatedWeight > 0 && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-green-500 text-xs">⚖️</span>
                                                <span>{ticket.estimatedWeight} kg estimated</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-end gap-3 mt-3 pt-3 border-t border-gray-100">
                                        <Link to={`/customerDashboard/schedule/${ticket._id}`}
                                            className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                                            <FaEye size={12} /> View
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(ticket._id)}
                                            disabled={deletingId === ticket._id || ticket.status === 'Completed'}
                                            className="flex items-center gap-1 text-xs text-red-500 hover:underline disabled:opacity-30">
                                            <FaTrash size={12} /> Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Waste Type</th>
                                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date & Time</th>
                                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Weight</th>
                                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((ticket) => {
                                    const statusStyle = STATUS_COLORS[ticket.status] || STATUS_COLORS['Scheduled'];
                                    return (
                                        <tr key={ticket._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{WASTE_TYPE_EMOJI[ticket.wasteType] || '🗑️'}</span>
                                                    <span className="text-sm font-medium text-gray-800">{ticket.wasteType || 'General'}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <p className="text-sm text-gray-800">{new Date(ticket.pickupDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                <p className="text-xs text-gray-500">{new Date(ticket.pickupDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-1 text-sm text-gray-700">
                                                    <FaMapMarkerAlt className="text-green-500 text-xs flex-shrink-0" />
                                                    <span className="truncate max-w-32">{ticket.location}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className="text-sm text-gray-700">
                                                    {ticket.estimatedWeight > 0 ? `${ticket.estimatedWeight} kg` : '—'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium w-fit ${statusStyle.bg} ${statusStyle.text}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                                                    {ticket.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <Link to={`/customerDashboard/schedule/${ticket._id}`}
                                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View details">
                                                        <FaEye size={14} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(ticket._id)}
                                                        disabled={deletingId === ticket._id || ticket.status === 'Completed'}
                                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                                                        title="Delete">
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
};

export default WasteCollectionList;