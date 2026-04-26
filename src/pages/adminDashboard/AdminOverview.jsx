import { useEffect, useState } from 'react';
import { apiGetScheduledProducts, apiGetProducts, apiGetLeaderboard } from '../../services/product';
import { FaRecycle, FaCheck, FaUsers, FaShoppingBag } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AdminOverview = () => {
    const [tickets, setTickets] = useState([]);
    const [products, setProducts] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [ticketsRes, productsRes, leaderboardRes] = await Promise.all([
                apiGetScheduledProducts(),
                apiGetProducts(),
                apiGetLeaderboard()
            ]);
            setTickets(ticketsRes.data || []);
            setProducts(productsRes.data || []);
            setLeaderboard(leaderboardRes.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const totalTickets = tickets.length;
    const completedTickets = tickets.filter(t => t.status === 'Completed').length;
    const scheduledTickets = tickets.filter(t => t.status === 'Scheduled').length;
    const inProgressTickets = tickets.filter(t => t.status === 'In Progress').length;
    const cancelledTickets = tickets.filter(t => t.status === 'Cancelled').length;
    const totalWaste = tickets.filter(t => t.status === 'Completed').reduce((sum, t) => sum + (t.actualWeight || 0), 0);
    const totalCarbon = tickets.filter(t => t.status === 'Completed').reduce((sum, t) => sum + (t.carbonSaved || 0), 0);

    const wasteTypeData = Object.entries(
        tickets.reduce((acc, t) => {
            const type = (t.wasteType || 'General Waste').split(' ')[0];
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {})
    ).map(([name, count]) => ({ name, count })).slice(0, 6);

    const monthlyData = Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(date.getMonth() - (5 - i));
        const month = date.toLocaleString('default', { month: 'short' });
        const count = tickets.filter(t => {
            const d = new Date(t.createdAt);
            return d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear();
        }).length;
        return { month, count };
    });

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
                        <h1 className="text-3xl font-bold mt-1">Platform Overview</h1>
                        <p className="text-green-200 text-sm mt-1">Taka Kipawa — Waste Management & Upcycling Marketplace</p>
                    </div>
                    <div className="text-6xl opacity-20">🌍</div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-xs uppercase">Total Pickups</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">{totalTickets}</h3>
                            <p className="text-xs text-blue-600 mt-1">All time</p>
                        </div>
                        <FaRecycle className="text-blue-500 text-2xl opacity-80" />
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-xs uppercase">Completed</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">{completedTickets}</h3>
                            <p className="text-xs text-green-600 mt-1">{totalTickets > 0 ? Math.round((completedTickets/totalTickets)*100) : 0}% rate</p>
                        </div>
                        <FaCheck className="text-green-500 text-2xl opacity-80" />
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-xs uppercase">Total Users</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">{leaderboard.length}</h3>
                            <p className="text-xs text-purple-600 mt-1">Registered</p>
                        </div>
                        <FaUsers className="text-purple-500 text-2xl opacity-80" />
                    </div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-teal-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-xs uppercase">Products</p>
                            <h3 className="text-3xl font-bold text-gray-800 mt-1">{products.length}</h3>
                            <p className="text-xs text-teal-600 mt-1">Marketplace</p>
                        </div>
                        <FaShoppingBag className="text-teal-500 text-2xl opacity-80" />
                    </div>
                </div>
            </div>

            {/* Environmental Impact */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">🌍 Platform Environmental Impact</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">{totalWaste}</p>
                        <p className="text-sm text-gray-600 mt-1">⚖️ kg Waste Collected</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">{totalCarbon}</p>
                        <p className="text-sm text-gray-600 mt-1">🌱 kg CO₂ Saved</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-yellow-600">{Math.round(totalWaste * 0.5)}</p>
                        <p className="text-sm text-gray-600 mt-1">🌳 Trees Equivalent</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-teal-600">{Math.round(totalWaste * 10)}</p>
                        <p className="text-sm text-gray-600 mt-1">💧 Litres Water Saved</p>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Monthly Pickups</h3>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#026937" strokeWidth={2} dot={{ fill: '#026937' }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">♻️ Waste Types Breakdown</h3>
                    {wasteTypeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={wasteTypeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Bar dataKey="count" fill="#00BFA5" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-48 text-gray-400">
                            <p>No data yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                    <p className="text-3xl font-bold text-blue-600">{scheduledTickets}</p>
                    <p className="text-sm text-blue-700 mt-1">🗓️ Scheduled</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 text-center border border-yellow-100">
                    <p className="text-3xl font-bold text-yellow-600">{inProgressTickets}</p>
                    <p className="text-sm text-yellow-700 mt-1">🔄 In Progress</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                    <p className="text-3xl font-bold text-green-600">{completedTickets}</p>
                    <p className="text-sm text-green-700 mt-1">✅ Completed</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center border border-red-100">
                    <p className="text-3xl font-bold text-red-600">{cancelledTickets}</p>
                    <p className="text-sm text-red-700 mt-1">❌ Cancelled</p>
                </div>
            </div>

            {/* Leaderboard */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-800">🏆 Community Leaderboard</h3>
                    <p className="text-sm text-gray-500 mt-1">Top recyclers on the platform</p>
                </div>
                <div className="p-4 space-y-3">
                    {leaderboard.slice(0, 5).map((user, index) => (
                        <div key={index} className={`flex items-center justify-between p-4 rounded-xl ${
                            index === 0 ? 'bg-yellow-50 border border-yellow-200' :
                            index === 1 ? 'bg-gray-50 border border-gray-200' :
                            index === 2 ? 'bg-orange-50 border border-orange-200' :
                            'bg-white border border-gray-100'
                        }`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                    index === 0 ? 'bg-yellow-400 text-white' :
                                    index === 1 ? 'bg-gray-300 text-white' :
                                    index === 2 ? 'bg-orange-400 text-white' :
                                    'bg-green-100 text-green-700'
                                }`}>
                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.level} • {user.badges?.length || 0} badges</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-green-600">{user.points} pts</p>
                                <p className="text-xs text-gray-500">{user.wasteCollected || 0} kg</p>
                            </div>
                        </div>
                    ))}
                    {leaderboard.length === 0 && (
                        <div className="text-center py-8 text-gray-400">
                            <p>No users yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;