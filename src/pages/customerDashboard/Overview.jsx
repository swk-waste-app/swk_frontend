import React, { useEffect, useState } from 'react';
import { apiGetUserStats, apiGetLeaderboard } from '../../services/product';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FaRecycle, FaLeaf, FaTrophy, FaFire, FaCalendarCheck, FaShoppingBag, FaStore, FaArrowRight, FaGlobe, FaBullseye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const LEVELS = [
    { name: 'Beginner', min: 0, max: 100, color: '#78909C', emoji: '🌱' },
    { name: 'Recycler', min: 100, max: 300, color: '#26A69A', emoji: '♻️' },
    { name: 'Eco Warrior', min: 300, max: 600, color: '#026937', emoji: '⚔️' },
    { name: 'Green Champion', min: 600, max: 1000, color: '#00BFA5', emoji: '🏆' },
    { name: 'Earth Guardian', min: 1000, max: Infinity, color: '#FFD700', emoji: '🌍' },
];

const BADGES = [
    { id: 'first_pickup', name: 'First Pickup', emoji: '🎯', desc: 'Scheduled first pickup' },
    { id: 'five_pickups', name: 'Regular', emoji: '⭐', desc: 'Completed 5 pickups' },
    { id: 'ten_pickups', name: 'Dedicated', emoji: '🌟', desc: 'Completed 10 pickups' },
    { id: 'eco_seller', name: 'Eco Seller', emoji: '🛍️', desc: 'Listed first product' },
    { id: 'carbon_saver', name: 'Carbon Saver', emoji: '🌿', desc: 'Saved 10kg CO₂' },
];

const ECO_TIPS = [
    "♻️ Segregating waste at source increases recycling efficiency by up to 60%.",
    "🌱 Composting organic waste reduces methane emissions from landfills.",
    "💧 Recycling one aluminium can saves enough energy to run a TV for 3 hours.",
    "🌍 Ghana generates over 12,000 tonnes of waste daily — you're making a difference!",
    "📦 Upcycling reduces the need for new raw materials and saves energy.",
    "🏭 Accra alone generates 1,500 tonnes of waste every day — every pickup counts!",
    "🌿 Plastic takes up to 1,000 years to decompose in landfills.",
];

const Overview = ({ role }) => {
    const [stats, setStats] = useState(null);
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tipIndex, setTipIndex] = useState(0);
    const [monthlyGoal, setMonthlyGoal] = useState(() => parseInt(localStorage.getItem('monthlyGoal')) || 4);
    const [editingGoal, setEditingGoal] = useState(false);
    const [newGoal, setNewGoal] = useState(monthlyGoal);

    useEffect(() => {
        fetchData();
        const tipInterval = setInterval(() => {
            setTipIndex(prev => (prev + 1) % ECO_TIPS.length);
        }, 5000);
        return () => clearInterval(tipInterval);
    }, []);

    const fetchData = async () => {
        try {
            const [statsRes, leaderboardRes] = await Promise.all([
                apiGetUserStats(),
                apiGetLeaderboard()
            ]);
            setStats(statsRes.data);
            setLeaderboard(leaderboardRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const saveGoal = () => {
        setMonthlyGoal(newGoal);
        localStorage.setItem('monthlyGoal', newGoal);
        setEditingGoal(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    const points = stats?.stats?.totalPoints || 0;
    const currentLevel = LEVELS.find(l => points >= l.min && points < l.max) || LEVELS[0];
    const nextLevel = LEVELS[LEVELS.indexOf(currentLevel) + 1];
    const progressPercent = nextLevel
        ? Math.round(((points - currentLevel.min) / (nextLevel.min - currentLevel.min)) * 100)
        : 100;

    const monthlyData = stats?.monthlyPickups?.map(item => ({
        name: MONTHS[item._id.month - 1],
        pickups: item.count
    })) || [];

    const pieData = [
        { name: 'Completed', value: stats?.stats?.completedPickups || 0, color: '#026937' },
        { name: 'Scheduled', value: stats?.stats?.scheduledPickups || 0, color: '#00BFA5' },
        { name: 'In Progress', value: stats?.stats?.inProgressPickups || 0, color: '#FFC107' },
        { name: 'Cancelled', value: stats?.stats?.cancelledPickups || 0, color: '#F44336' },
    ].filter(item => item.value > 0);

    const thisMonthPickups = stats?.monthlyPickups?.find(item => {
        const now = new Date();
        return item._id.month === now.getMonth() + 1 && item._id.year === now.getFullYear();
    })?.count || 0;

    const goalProgress = Math.min(Math.round((thisMonthPickups / monthlyGoal) * 100), 100);

    const userRank = leaderboard.findIndex(u => u.name === stats?.user?.name) + 1;

    return (
        <div className="space-y-6 p-4 bg-gray-50 min-h-screen">

            {/* Eco Tip Banner */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                <FaLeaf className="text-green-600 text-xl flex-shrink-0" />
                <p className="text-green-800 text-sm font-medium">{ECO_TIPS[tipIndex]}</p>
            </div>

            {/* Level Banner */}
            <div className="rounded-2xl p-6 text-white relative overflow-hidden"
                style={{ background: `linear-gradient(135deg, #026937, #00BFA5)` }}>
                <div className="absolute top-0 right-0 w-48 h-48 opacity-10 text-9xl flex items-center justify-center">
                    {currentLevel.emoji}
                </div>
                <div className="flex items-center justify-between relative z-10">
                    <div>
                        <p className="text-green-200 text-sm uppercase tracking-wider">Current Level</p>
                        <h2 className="text-3xl font-bold">{currentLevel.name} {currentLevel.emoji}</h2>
                        <p className="text-green-200 mt-1">{points} points earned</p>
                    </div>
                    <div className="text-right">
                        {userRank > 0 && (
                            <div className="bg-white bg-opacity-20 rounded-lg px-3 py-1 mb-2">
                                <p className="text-white text-xs">Community Rank</p>
                                <p className="text-white font-bold text-xl">#{userRank}</p>
                            </div>
                        )}
                        <p className="text-green-200 text-xs">Next: {nextLevel?.name || 'Max Level'}</p>
                        <p className="text-white font-bold text-lg">{progressPercent}%</p>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="flex justify-between text-xs text-green-200 mb-1">
                        <span>{currentLevel.min} pts</span>
                        <span>{nextLevel?.min || '∞'} pts</span>
                    </div>
                    <div className="w-full bg-green-900 rounded-full h-3">
                        <div
                            className="bg-white rounded-full h-3 transition-all duration-1000"
                            style={{ width: `${progressPercent}%` }}
                        ></div>
                    </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <FaFire className="text-orange-300" />
                        <span className="text-sm">{stats?.stats?.streak || 0} week streak</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaLeaf className="text-green-300" />
                        <span className="text-sm">{stats?.stats?.totalCarbonSaved || 0} kg CO₂ saved</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FaTrophy className="text-yellow-300" />
                        <span className="text-sm">{stats?.user?.badges?.length || 0} badges</span>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Link to="/customerDashboard/pickup"
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                        <FaCalendarCheck className="text-green-600 group-hover:text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Action</p>
                        <p className="text-sm font-semibold text-gray-800">Schedule Pickup</p>
                    </div>
                    <FaArrowRight className="text-gray-300 ml-auto group-hover:text-green-600 transition-colors" />
                </Link>
                <Link to="/customerDashboard/products"
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center group-hover:bg-teal-600 transition-colors">
                        <FaShoppingBag className="text-teal-600 group-hover:text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Explore</p>
                        <p className="text-sm font-semibold text-gray-800">Buy Recycled</p>
                    </div>
                    <FaArrowRight className="text-gray-300 ml-auto group-hover:text-teal-600 transition-colors" />
                </Link>
                <Link to="/login"
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                        <FaStore className="text-purple-600 group-hover:text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Earn</p>
                        <p className="text-sm font-semibold text-gray-800">Sell Items</p>
                    </div>
                    <FaArrowRight className="text-gray-300 ml-auto group-hover:text-purple-600 transition-colors" />
                </Link>
                <Link to="/customerDashboard/blogs"
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                        <FaGlobe className="text-blue-600 group-hover:text-white" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500">Learn</p>
                        <p className="text-sm font-semibold text-gray-800">Read News</p>
                    </div>
                    <FaArrowRight className="text-gray-300 ml-auto group-hover:text-blue-600 transition-colors" />
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-600">
                    <p className="text-gray-500 text-xs uppercase tracking-wider">Total Pickups</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats?.stats?.totalPickups || 0}</h3>
                    <p className="text-xs text-green-600 mt-1">All time</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-teal-500">
                    <p className="text-gray-500 text-xs uppercase tracking-wider">Completed</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats?.stats?.completedPickups || 0}</h3>
                    <p className="text-xs text-teal-600 mt-1">Successfully done</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-500">
                    <p className="text-gray-500 text-xs uppercase tracking-wider">Waste Collected</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats?.stats?.totalWasteCollected || 0} <span className="text-lg font-normal">kg</span></h3>
                    <p className="text-xs text-yellow-600 mt-1">Total weight</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
                    <p className="text-gray-500 text-xs uppercase tracking-wider">Carbon Saved</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats?.stats?.totalCarbonSaved || 0} <span className="text-lg font-normal">kg</span></h3>
                    <p className="text-xs text-blue-600 mt-1">CO₂ equivalent</p>
                </div>
            </div>

            {/* Goal Setting + Environmental Impact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Monthly Goal */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">🎯 Monthly Goal</h3>
                        <button onClick={() => setEditingGoal(!editingGoal)}
                            className="text-xs text-green-600 hover:underline">
                            {editingGoal ? 'Cancel' : 'Edit Goal'}
                        </button>
                    </div>
                    {editingGoal ? (
                        <div className="flex items-center gap-3">
                            <input
                                type="number"
                                value={newGoal}
                                onChange={e => setNewGoal(parseInt(e.target.value))}
                                className="w-20 border rounded-lg p-2 text-center text-gray-700"
                                min="1" max="30"
                            />
                            <span className="text-gray-600 text-sm">pickups this month</span>
                            <button onClick={saveGoal}
                                className="bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700">
                                Save
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-end gap-2 mb-3">
                                <span className="text-4xl font-bold text-green-600">{thisMonthPickups}</span>
                                <span className="text-gray-500 text-lg mb-1">/ {monthlyGoal} pickups</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-4">
                                <div
                                    className="bg-green-500 rounded-full h-4 transition-all duration-1000 flex items-center justify-end pr-2"
                                    style={{ width: `${goalProgress}%` }}>
                                    {goalProgress > 20 && <span className="text-white text-xs font-bold">{goalProgress}%</span>}
                                </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                {goalProgress >= 100 ? '🎉 Goal achieved! Amazing work!' :
                                 `${monthlyGoal - thisMonthPickups} more pickup${monthlyGoal - thisMonthPickups !== 1 ? 's' : ''} to reach your goal`}
                            </p>
                        </>
                    )}
                </div>

                {/* Environmental Impact */}
                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 shadow-sm border border-green-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🌍 Your Environmental Impact</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">
                                {Math.round((stats?.stats?.totalWasteCollected || 0) * 0.5)}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">🌳 Trees equivalent</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">
                                {Math.round((stats?.stats?.totalCarbonSaved || 0) / 0.21)}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">🚗 Car trips avoided</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-yellow-600">
                                {Math.round((stats?.stats?.totalWasteCollected || 0) * 1.5)}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">💡 Hours of electricity</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-teal-600">
                                {Math.round((stats?.stats?.totalWasteCollected || 0) * 10)}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">💧 Litres of water saved</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Vendor Stats */}
            {role === 'vendor' && stats?.vendorStats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
                        <p className="text-gray-500 text-xs uppercase tracking-wider">Products Listed</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.vendorStats.totalProducts}</h3>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-pink-500">
                        <p className="text-gray-500 text-xs uppercase tracking-wider">Total Views</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.vendorStats.totalViews}</h3>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500">
                        <p className="text-gray-500 text-xs uppercase tracking-wider">Items Sold</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-1">{stats.vendorStats.totalSold}</h3>
                    </div>
                    <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
                        <p className="text-gray-500 text-xs uppercase tracking-wider">Revenue</p>
                        <h3 className="text-3xl font-bold text-gray-800 mt-1">GH₵ {stats.vendorStats.totalRevenue?.toFixed(2) || '0.00'}</h3>
                    </div>
                </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Monthly Pickups</h3>
                    {monthlyData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <AreaChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                <YAxis tick={{ fontSize: 12 }} />
                                <Tooltip />
                                <Area type="monotone" dataKey="pickups" stroke="#026937" fill="#00BFA5" fillOpacity={0.3} strokeWidth={2} />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                            <FaCalendarCheck className="text-4xl mb-2 opacity-30" />
                            <p>No pickup data yet</p>
                            <Link to="/customerDashboard/pickup" className="mt-2 text-green-600 text-sm hover:underline">Schedule your first pickup →</Link>
                        </div>
                    )}
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">🥧 Pickup Status</h3>
                    {pieData.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={160}>
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                                        {pieData.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="flex flex-wrap gap-2 justify-center mt-2">
                                {pieData.map((entry, index) => (
                                    <div key={index} className="flex items-center gap-1">
                                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                        <span className="text-xs text-gray-600">{entry.name}: {entry.value}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                            <FaRecycle className="text-4xl mb-2 opacity-30" />
                            <p>No pickup data yet</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">🏅 Badges</h3>
                <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">
                    {BADGES.map((badge) => {
                        const earned = stats?.user?.badges?.includes(badge.id);
                        return (
                            <div key={badge.id} className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all ${earned ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200 bg-gray-50 opacity-50'}`}>
                                <span className="text-3xl">{badge.emoji}</span>
                                <p className="text-xs font-semibold text-gray-700 mt-1 text-center">{badge.name}</p>
                                <p className="text-xs text-gray-500 text-center">{badge.desc}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Leaderboard + Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Leaderboard */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">🏆 Community Leaderboard</h3>
                        <span className="text-xs text-gray-500">Top Recyclers</span>
                    </div>
                    {leaderboard.length > 0 ? (
                        <div className="space-y-3">
                            {leaderboard.slice(0, 5).map((user, index) => (
                                <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${user.name === stats?.user?.name ? 'bg-green-50 border border-green-200' : 'bg-gray-50'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                                            index === 0 ? 'bg-yellow-400 text-white' :
                                            index === 1 ? 'bg-gray-300 text-white' :
                                            index === 2 ? 'bg-orange-400 text-white' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                            {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">
                                                {user.name} {user.name === stats?.user?.name ? <span className="text-green-600 text-xs">(You)</span> : ''}
                                            </p>
                                            <p className="text-xs text-gray-500">{user.level}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-green-600">{user.points} pts</p>
                                        <p className="text-xs text-gray-500">{user.wasteCollected} kg</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <FaTrophy className="text-4xl mx-auto mb-2 opacity-30" />
                            <p>No leaderboard data yet</p>
                            <p className="text-sm">Be the first to earn points!</p>
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">🕐 Recent Activity</h3>
                        <Link to="/customerDashboard/pickup" className="text-green-600 text-sm hover:underline">View all →</Link>
                    </div>
                    {stats?.recentPickups?.length > 0 ? (
                        <div className="space-y-3">
                            {stats.recentPickups.map((pickup, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                            pickup.status === 'Completed' ? 'bg-green-100' :
                                            pickup.status === 'In Progress' ? 'bg-yellow-100' :
                                            pickup.status === 'Cancelled' ? 'bg-red-100' : 'bg-blue-100'
                                        }`}>
                                            <FaRecycle className={`${
                                                pickup.status === 'Completed' ? 'text-green-600' :
                                                pickup.status === 'In Progress' ? 'text-yellow-600' :
                                                pickup.status === 'Cancelled' ? 'text-red-600' : 'text-blue-600'
                                            }`} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{pickup.location}</p>
                                            <p className="text-xs text-gray-500">{new Date(pickup.pickupDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                                        pickup.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                        pickup.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                                        pickup.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                    }`}>{pickup.status}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-400">
                            <FaCalendarCheck className="text-4xl mx-auto mb-2 opacity-30" />
                            <p className="font-medium">No recent activity yet</p>
                            <p className="text-sm">Schedule your first waste pickup!</p>
                            <Link to="/customerDashboard/pickup"
                                className="mt-3 inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors">
                                Schedule Now
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Overview;