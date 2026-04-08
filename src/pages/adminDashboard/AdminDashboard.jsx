import React, { useEffect, useState } from 'react';
import { apiGetScheduledProducts, apiEditScheduledProduct } from '../../services/product';
import { FaCalendarAlt, FaMapMarkerAlt, FaRecycle, FaSearch } from 'react-icons/fa';
import Swal from 'sweetalert2';

const STATUS_COLORS = {
    'Scheduled': { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
    'In Progress': { bg: 'bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    'Completed': { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    'Cancelled': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

const WASTE_TYPE_EMOJI = {
    'General Waste': '🗑️', 'Recyclable Materials': '♻️', 'Organic/Food Waste': '🌿',
    'Electronic (E-Waste)': '💻', 'Hazardous Waste': '⚠️', 'Fashion & Textiles': '👗',
    'Plastics': '🧴', 'Metals & Scrap': '🔩', 'Glass': '🍶',
    'Wood & Furniture': '🪵', 'Paper & Cardboard': '📄', 'Rubber': '⚫', 'Other': '📦',
};

const AdminDashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [filtered, setFiltered] = useState([]);
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
            const response = await apiGetScheduledProducts();
            setTickets(response.data || []);
        } catch (error) {
            console.error('Error fetching tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (ticketId, newStatus) => {
        const result = await Swal.fire({
            title: 'Update Status',
            text: `Mark this ticket as "${newStatus}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#026937',
            cancelButtonColor: '#EF4444',
            confirmButtonText: 'Yes, update it!'
        });
        if (result.isConfirmed) {
            try {
                await apiEditScheduledProduct(ticketId, { status: newStatus });
                const response = await apiGetScheduledProducts();
                setTickets(response.data || []);
                Swal.fire({ icon: 'success', title: 'Updated!', timer: 1500, showConfirmButton: false });
            } catch (error) {
                Swal.fire({ icon: 'error', title: 'Failed to update status' });
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 bg-gray-50 min-h-screen">

            {/* Header */}
            <div className="rounded-2xl p-6 text-white"
                style={{ background: 'linear-gradient(135deg, #026937, #00BFA5)' }}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-green-200 text-sm uppercase tracking-wider">Admin Portal</p>
                        <h1 className="text-3xl font-bold mt-1">Ticket Management</h1>
                        <p className="text-green-200 text-sm mt-1">{tickets.length} total pickup tickets</p>
                    </div>
                    <div className="text-6xl opacity-20">🎫</div>
                </div>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setStatusFilter('Scheduled')}>
                    <p className="text-3xl font-bold text-blue-600">{tickets.filter(t => t.status === 'Scheduled').length}</p>
                    <p className="text-sm text-blue-700 mt-1">🗓️ Scheduled</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center border border-yellow-100 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setStatusFilter('In Progress')}>
                    <p className="text-3xl font-bold text-yellow-600">{tickets.filter(t => t.status === 'In Progress').length}</p>
                    <p className="text-sm text-yellow-700 mt-1">🔄 In Progress</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setStatusFilter('Completed')}>
                    <p className="text-3xl font-bold text-green-600">{tickets.filter(t => t.status === 'Completed').length}</p>
                    <p className="text-sm text-green-700 mt-1">✅ Completed</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setStatusFilter('Cancelled')}>
                    <p className="text-3xl font-bold text-red-600">{tickets.filter(t => t.status === 'Cancelled').length}</p>
                    <p className="text-sm text-red-700 mt-1">❌ Cancelled</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-3 text-gray-400 text-sm" />
                    <input
                        type="text"
                        placeholder="Search by location or waste type..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-700"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                    <option value="All">All Status</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
                {statusFilter !== 'All' && (
                    <button onClick={() => setStatusFilter('All')}
                        className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm hover:bg-gray-200">
                        Clear Filter
                    </button>
                )}
            </div>

            {/* Tickets Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-semibold text-gray-800">All Pickup Tickets</h3>
                    <span className="text-sm text-gray-500">{filtered.length} results</span>
                </div>

                {/* Mobile Cards */}
                <div className="block lg:hidden p-4 space-y-4">
                    {filtered.map(ticket => {
                        const statusStyle = STATUS_COLORS[ticket.status] || STATUS_COLORS['Scheduled'];
                        return (
                            <div key={ticket._id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="text-2xl">{WASTE_TYPE_EMOJI[ticket.wasteType] || '🗑️'}</span>
                                        <div>
                                            <p className="font-medium text-gray-800 text-sm">{ticket.wasteType || 'General Waste'}</p>
                                            <p className="text-xs text-gray-400">ID: {ticket._id?.slice(-8)}</p>
                                        </div>
                                    </div>
                                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                                        {ticket.status}
                                    </span>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600 mb-3">
                                    <div className="flex items-center gap-2">
                                        <FaCalendarAlt className="text-green-500 text-xs" />
                                        <span>{new Date(ticket.pickupDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <FaMapMarkerAlt className="text-green-500 text-xs" />
                                        <span>{ticket.location}</span>
                                    </div>
                                </div>
                                {ticket.status !== 'Completed' && ticket.status !== 'Cancelled' && (
                                    <div className="flex gap-2">
                                        <button onClick={() => handleStatusChange(ticket._id, 'In Progress')}
                                            className="flex-1 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium hover:bg-yellow-200">
                                            🔄 In Progress
                                        </button>
                                        <button onClick={() => handleStatusChange(ticket._id, 'Completed')}
                                            className="flex-1 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200">
                                            ✅ Complete
                                        </button>
                                        <button onClick={() => handleStatusChange(ticket._id, 'Cancelled')}
                                            className="flex-1 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200">
                                            ❌ Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Desktop Table */}
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase">Waste Type</th>
                                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase">Location</th>
                                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase">Weight</th>
                                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="py-3 px-6 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(ticket => {
                                const statusStyle = STATUS_COLORS[ticket.status] || STATUS_COLORS['Scheduled'];
                                return (
                                    <tr key={ticket._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xl">{WASTE_TYPE_EMOJI[ticket.wasteType] || '🗑️'}</span>
                                                <span className="text-sm font-medium text-gray-800">{ticket.wasteType || 'General Waste'}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-sm text-gray-800">{new Date(ticket.pickupDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                            <p className="text-xs text-gray-400">{new Date(ticket.pickupDate).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-1 text-sm text-gray-700">
                                                <FaMapMarkerAlt className="text-green-500 text-xs flex-shrink-0" />
                                                <span className="truncate max-w-xs">{ticket.location}</span>
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
                                            {ticket.status !== 'Completed' && ticket.status !== 'Cancelled' ? (
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleStatusChange(ticket._id, 'In Progress')}
                                                        className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium hover:bg-yellow-200 transition-colors">
                                                        🔄 In Progress
                                                    </button>
                                                    <button onClick={() => handleStatusChange(ticket._id, 'Completed')}
                                                        className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium hover:bg-green-200 transition-colors">
                                                        ✅ Complete
                                                    </button>
                                                    <button onClick={() => handleStatusChange(ticket._id, 'Cancelled')}
                                                        className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors">
                                                        ❌ Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-gray-400 italic">No actions available</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="text-center py-16 text-gray-400">
                        <FaRecycle className="text-5xl mx-auto mb-3 opacity-20" />
                        <p className="font-medium">No tickets found</p>
                        <p className="text-sm mt-1">Try adjusting your search or filter</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;