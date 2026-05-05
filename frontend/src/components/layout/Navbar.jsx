import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Wallet, User as UserIcon, LogOut } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-gray-950 border-b border-gray-800 sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="text-2xl font-bold tracking-tighter">
                    Campus<span className="text-gray-400">Eats</span>
                </Link>

                <div className="flex items-center gap-6 text-sm font-medium">
                    <Link to="/explore" className="hover:text-gray-400">Explore</Link>
                    {user && (
                        <>
                            <Link to="/wallet" className="flex items-center gap-2 hover:text-gray-400">
                                <Wallet size={18} /> Wallet
                            </Link>
                            <Link to="/orders" className="flex items-center gap-2 hover:text-gray-400">
                                <ShoppingBag size={18} /> Orders
                            </Link>
                            {user.role === 'PlatformAdmin' && (
                                <Link to="/admin" className="hover:text-gray-400">Admin</Link>
                            )}
                            {user.role === 'InstitutionAdmin' && (
                                <Link to="/institution-admin" className="hover:text-gray-400">Dashboard</Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-red-500 hover:text-red-400"
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    )}
                    {!user && (
                        <>
                            <Link to="/login" className="hover:text-gray-400">Login</Link>
                            <Link 
                                to="/register" 
                                className="bg-white text-black px-4 py-1.5 rounded-lg hover:scale-105 transition"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
