import { useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { FaHome, FaTrashAlt, FaBlog, FaFileAlt, FaSignOutAlt, FaBars, FaTimes, FaStore, FaShoppingBag, FaPlus, FaBookOpen, FaRobot } from 'react-icons/fa';
import NotificationBell from '../../components/NotificationBell';
import ThemeToggle from '../../components/ThemeToggle';

const SideBar = ({ profile, role }) => {
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    const LogOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        // The offline API cache holds this user's personal data; drop it so the
        // next person on a shared device can never be served it.
        if ('caches' in window) caches.delete('swk-api').catch(() => {});
        setTimeout(() => { navigate("/"); }, 1000);
    };

    const isActiveLink = (path) => location.pathname.includes(path);

    const navLinkClass = (path) => `p-4 cursor-pointer flex items-center transition-all duration-200 rounded-lg mx-2 mb-1 ${
        isActiveLink(path)
            ? 'bg-white text-green-800 font-semibold shadow-sm'
            : 'text-white hover:bg-green-700'
    }`;

    const overviewPath = role === 'admin' 
    ? '/customerDashboard/adminoverview' 
    : role === 'vendor' 
    ? '/customerDashboard/vendoroverview' 
    : '/customerDashboard/overview';

const overviewActive = role === 'admin' 
    ? isActiveLink('/adminoverview') 
    : role === 'vendor' 
    ? isActiveLink('/vendoroverview') 
    : isActiveLink('/overview');

    return (
        <>
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-green-800 text-white p-4 flex items-center justify-between">
                <button onClick={toggleSidebar} className="text-white focus:outline-none">
                    {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
                </button>
                <h1 className="font-bold text-lg">Taka Kipawa</h1>
                <div className="flex items-center gap-1">
                    <ThemeToggle className="text-white hover:bg-green-700" />
                    <NotificationBell placement="header" />
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
                        {/* Theme + real notifications (all roles) */}
                        <div className="hidden lg:flex items-center gap-0.5">
                            <ThemeToggle className="text-white hover:bg-green-700" />
                            <NotificationBell placement="sidebar" />
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="mt-4 pb-20">
                        <ul>
                            {/* Overview — all roles */}
                            <li className={`p-4 cursor-pointer flex items-center transition-all duration-200 rounded-lg mx-2 mb-1 ${
                                overviewActive ? 'bg-white text-green-800 font-semibold shadow-sm' : 'text-white hover:bg-green-700'
                            }`}>
                                <FaHome className="mr-3 text-sm" />
                                <Link to={overviewPath} onClick={() => setSidebarOpen(false)} className="block w-full">Overview</Link>
                            </li>

                            {/* AI Scanner — all roles */}
                            <li className={navLinkClass("/scan")}>
                                <FaRobot className="mr-3 text-sm" />
                                <Link to="/customerDashboard/scan" onClick={() => setSidebarOpen(false)} className="block w-full flex items-center justify-between">
                                    AI Scanner
                                    <span className="text-[9px] font-bold uppercase tracking-wider bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full">New</span>
                                </Link>
                            </li>

                            {/* User Links */}
                            {role === "user" && (
                                <>
                                    <li className={navLinkClass("/pickup")}>
                                        <FaTrashAlt className="mr-3 text-sm" />
                                        <Link to="/customerDashboard/pickup" onClick={() => setSidebarOpen(false)} className="block w-full">Waste Collection</Link>
                                    </li>
                                    <li className={navLinkClass("/products")}>
                                        <FaShoppingBag className="mr-3 text-sm" />
                                        <Link to="/customerDashboard/products" onClick={() => setSidebarOpen(false)} className="block w-full">Marketplace</Link>
                                    </li>
                                    <li className={navLinkClass("/login")}>
                                        <FaStore className="mr-3 text-sm" />
                                        <Link to="/login" onClick={() => setSidebarOpen(false)} className="block w-full">Sell here</Link>
                                    </li>
                                </>
                            )}

                            {/* Admin Links */}
                            {role === "admin" && (
                                <>
                                    <li className={navLinkClass("/adminview")}>
                                        <FaTrashAlt className="mr-3 text-sm" />
                                        <Link to="/customerDashboard/adminview" onClick={() => setSidebarOpen(false)} className="block w-full">Ticket Management</Link>
                                    </li>
                                    <li className={navLinkClass("/addEducation")}>
                                        <FaBookOpen className="mr-3 text-sm" />
                                        <Link to="/customerDashboard/addEducation" onClick={() => setSidebarOpen(false)} className="block w-full">Add Resource</Link>
                                    </li>
                                </>
                            )}

                            {/* Vendor Links */}
                            {role === "vendor" && (
                                <>
                                    <li className={navLinkClass("/vendorProduct")}>
                                        <FaFileAlt className="mr-3 text-sm" />
                                        <Link to="/customerDashboard/vendorProduct" onClick={() => setSidebarOpen(false)} className="block w-full">My Products</Link>
                                    </li>
                                    <li className={navLinkClass("/addProduct")}>
                                        <FaPlus className="mr-3 text-sm" />
                                        <Link to="/customerDashboard/addProduct" onClick={() => setSidebarOpen(false)} className="block w-full">Add Product</Link>
                                    </li>
                                    <li className={navLinkClass("/products")}>
                                        <FaShoppingBag className="mr-3 text-sm" />
                                        <Link to="/customerDashboard/products" onClick={() => setSidebarOpen(false)} className="block w-full">Marketplace</Link>
                                    </li>
                                </>
                            )}

                            <div className="mx-2 my-2 border-t border-green-700"></div>

                            <li className={navLinkClass("/blogs")}>
                                <FaBlog className="mr-3 text-sm" />
                                <Link to="/customerDashboard/blogs" onClick={() => setSidebarOpen(false)} className="block w-full">Blogs</Link>
                            </li>
                            <li className={navLinkClass("/articles")}>
                                <FaFileAlt className="mr-3 text-sm" />
                                <Link to="/customerDashboard/articles" onClick={() => setSidebarOpen(false)} className="block w-full">Articles</Link>
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