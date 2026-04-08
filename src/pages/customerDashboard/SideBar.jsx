import React, { useState, useEffect } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { FaHome, FaRecycle, FaTrashAlt, FaBlog, FaFileAlt, FaSignOutAlt, FaBars, FaTimes, FaBell } from 'react-icons/fa';
import { FaStore } from 'react-icons/fa';
import { apiGetUserStats } from '../../services/product';

const SideBar = ({ profile, role }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (role !== 'admin') {
            fetchNotifications();
        }
    }, [role]);

    const fetchNotifications = async () => {
        try {
            const response = await apiGetUserStats();
            const notifs = [];
            if (response.data?.stats?.scheduledPickups > 0) {
                notifs.push({
                    id: 1,
                    message: `You have ${response.data.stats.scheduledPickups} scheduled pickup${response.data.stats.scheduledPickups > 1 ? 's' : ''}`,
                    type: 'pickup',
                    time: 'Pending'
                });
            }
            if (response.data?.stats?.inProgressPickups > 0) {
                notifs.push({
                    id: 2,
                    message: `${response.data.stats.inProgressPickups} pickup${response.data.stats.inProgressPickups > 1 ? 's are' : ' is'} in progress`,
                    type: 'progress',
                    time: 'Active'
                });
            }
            if (!response.data?.stats?.totalPickups) {
                notifs.push({
                    id: 3,
                    message: 'Welcome! Schedule your first waste pickup',
                    type: 'welcome',
                    time: 'New'
                });
            }
            setNotifications(notifs);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const LogOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setTimeout(() => { navigate("/"); }, 1000);
    };

    const isActiveLink = (path) => location.pathname.includes(path);

    const navLinkClass = (path) => `p-4 cursor-pointer flex items-center transition-all duration-200 rounded-lg mx-2 mb-1 ${
        isActiveLink(path)
            ? 'bg-white text-green-800 font-semibold shadow-sm'
            : 'text-white hover:bg-green-700'
    }`;

    const overviewPath = role === 'admin' ? '/customerDashboard/adminoverview' : '/customerDashboard/overview';
    const overviewActive = role === 'admin' ? isActiveLink('/adminoverview') : isActiveLink('/overview');

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-green-800 text-white p-4 flex items-center justify-between">
                <button onClick={toggleSidebar} className="text-white focus:outline-none">
                    {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
                <h1 className="font-bold text-lg">Taka Kipawa</h1>
                <div className="relative">
                    <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
                        <FaBell size={20} />
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">
                                {notifications.length}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex">
                {/* Overlay */}
                {isSidebarOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                        onClick={() => setSidebarOpen(false)} />
                )}

                {/* Sidebar */}
                <div className={`fixed left-0 h-screen w-64 bg-green-800 text-white overflow-y-auto transition-transform duration-300 z-40 lg:z-auto ${
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}>

                    {/* Profile Section */}
                    <div className="p-6 flex items-center justify-between border-b border-green-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-lg font-bold border-2 border-green-400">
                                {profile?.name ? profile.name[0].toUpperCase() : "?"}
                            </div>
                            <div>
                                <p className="text-xs text-green-300">Welcome back,</p>
                                <p className="text-sm font-semibold">{profile?.name || "User"}</p>
                                {role === 'admin' && (
                                    <span className="text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-bold">Admin</span>
                                )}
                                {role === 'vendor' && (
                                    <span className="text-xs bg-purple-400 text-white px-2 py-0.5 rounded-full font-bold">Vendor</span>
                                )}
                            </div>
                        </div>
                        {/* Notification Bell — only for non-admin */}
                        {role !== 'admin' && (
                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="text-white hover:text-yellow-300 transition-colors relative">
                                    <FaBell size={18} />
                                    {notifications.length > 0 && (
                                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                                            {notifications.length}
                                        </span>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Notification Dropdown */}
                    {showNotifications && role !== 'admin' && (
                        <div className="mx-2 mt-2 bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="p-3 bg-gray-50 border-b flex items-center justify-between">
                                <p className="text-xs font-semibold text-gray-700">Notifications</p>
                                <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600">
                                    <FaTimes size={12} />
                                </button>
                            </div>
                            {notifications.map(notif => (
                                <div key={notif.id} className="p-3 border-b hover:bg-gray-50 flex items-start gap-2">
                                    <span className="text-lg">
                                        {notif.type === 'pickup' ? '🗓️' :
                                         notif.type === 'progress' ? '🔄' : '👋'}
                                    </span>
                                    <div>
                                        <p className="text-xs text-gray-700">{notif.message}</p>
                                        <p className="text-xs text-green-600 mt-1">{notif.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Navigation */}
                    <nav className="mt-4 pb-20">
                        <ul>
                            {/* Overview — all roles */}
                            <li className={`p-4 cursor-pointer flex items-center transition-all duration-200 rounded-lg mx-2 mb-1 ${
                                overviewActive ? 'bg-white text-green-800 font-semibold shadow-sm' : 'text-white hover:bg-green-700'
                            }`}>
                                <FaHome className="mr-3 text-sm" />
                                <Link to={overviewPath} className="block w-full">Overview</Link>
                            </li>

                            {/* User Links */}
                            {role === "user" && (
                                <>
                                    <li className={navLinkClass("/pickup")}>
                                        <FaTrashAlt className="mr-3 text-sm" />
                                        <Link to="/customerDashboard/pickup" className="block w-full">Waste Collection</Link>
                                    </li>
                                    <li className={navLinkClass("/products")}>
                                        <FaRecycle className="mr-3 text-sm" />
                                        <Link to="/customerDashboard/products" className="block w-full">Recycle</Link>
                                    </li>
                                    <li className={navLinkClass("/login")}>
                                        <FaStore className="mr-3 text-sm" />
                                        <Link to="/login" className="block w-full">Sell here</Link>
                                    </li>
                                </>
                            )}

                            {/* Admin Links */}
                            {role === "admin" && (
                                <li className={navLinkClass("/adminview")}>
                                    <FaTrashAlt className="mr-3 text-sm" />
                                    <Link to="/customerDashboard/adminview" className="block w-full">Ticket Management</Link>
                                </li>
                            )}

                            {/* Vendor Links */}
                            {role === "vendor" && (
                                <>
                                    <li className={navLinkClass("/vendorProduct")}>
                                        <FaFileAlt className="mr-3 text-sm" />
                                        <Link to="/customerDashboard/vendorProduct" className="block w-full">Vendor Product</Link>
                                    </li>
                                    <li className={navLinkClass("/addProduct")}>
                                        <FaStore className="mr-3 text-sm" />
                                        <Link to="/customerDashboard/addProduct" className="block w-full">Add Product</Link>
                                    </li>
                                </>
                            )}

                            <div className="mx-2 my-2 border-t border-green-700"></div>

                            <li className={navLinkClass("/blogs")}>
                                <FaBlog className="mr-3 text-sm" />
                                <Link to="/customerDashboard/blogs" className="block w-full">Blogs</Link>
                            </li>
                            <li className={navLinkClass("/articles")}>
                                <FaFileAlt className="mr-3 text-sm" />
                                <Link to="/customerDashboard/articles" className="block w-full">Articles</Link>
                            </li>
                        </ul>
                    </nav>

                    {/* Logout */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-700 bg-green-800">
                        <button onClick={LogOut}
                            className="w-full p-3 flex items-center justify-center gap-2 text-white bg-green-700 rounded-lg hover:bg-red-600 transition-colors duration-200">
                            <FaSignOutAlt />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="ml-0 lg:ml-64 flex-1 transition-all duration-300 pt-14 lg:pt-0"
                key={role + location.pathname}>
                <Outlet />
            </div>
        </>
    );
};

export default SideBar;