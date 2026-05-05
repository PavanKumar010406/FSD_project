import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Card, Button } from '../components/common';
import { ShoppingCart, ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';

const Menu = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [institution, setInstitution] = useState(null);
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [orderLoading, setOrderLoading] = useState(false);

    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const [instRes, menuRes] = await Promise.all([
                    API.get('/institutions'),
                    API.get(`/menu/${id}`)
                ]);
                const inst = instRes.data.find(i => i._id === id);
                setInstitution(inst);
                setMenuItems(menuRes.data);
            } catch (error) {
                console.error('Error fetching menu data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchMenuData();
    }, [id]);

    const addToCart = (item) => {
        const exists = cart.find(i => i.name === item.name);
        if (exists) {
            setCart(cart.map(i => i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i));
        } else {
            setCart([...cart, { ...item, quantity: 1 }]);
        }
    };

    const removeFromCart = (name) => {
        const item = cart.find(i => i.name === name);
        if (item.quantity > 1) {
            setCart(cart.map(i => i.name === name ? { ...i, quantity: i.quantity - 1 } : i));
        } else {
            setCart(cart.filter(i => i.name !== name));
        }
    };

    const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handlePlaceOrder = async () => {
        if (!user) return navigate('/login');
        if (cart.length === 0) return;

        setOrderLoading(true);
        try {
            await API.post('/order', {
                institutionId: id,
                items: cart,
                totalAmount,
                orderType: 'Instant'
            });
            navigate('/orders');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to place order');
        } finally {
            setOrderLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin"></div>
        </div>
    );

    if (!institution) return <div className="text-center py-20">Institution not found.</div>;

    return (
        <div className="grid lg:grid-cols-3 gap-12 py-8 relative">
            <div className="lg:col-span-2 space-y-12">
                <div className="space-y-4">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-white transition">
                        <ArrowLeft size={18} /> Back to Directory
                    </button>
                    <h1 className="text-5xl font-black uppercase tracking-tighter italic tabular-nums">{institution.name}</h1>
                    <p className="text-gray-400 font-medium max-w-xl">{institution.description}</p>
                </div>

                <div className="grid md:grid-cols-1 gap-6">
                    {menuItems && menuItems.map((item, i) => (
                        <div 
                            key={i}
                            className="bg-gray-900 border border-gray-800 p-8 rounded-3xl flex justify-between items-center group hover:border-gray-700 transition"
                        >
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold">{item.name}</h3>
                                <p className="text-gray-400 text-sm uppercase tracking-wider">{item.category}</p>
                                <p className="text-2xl font-black tabular-nums tracking-tighter">{item.price} <span className="text-sm font-bold text-gray-500">COINS</span></p>
                            </div>
                            <Button 
                                onClick={() => addToCart(item)}
                                className="w-14 h-14 rounded-2xl flex items-center justify-center p-0"
                            >
                                <Plus size={24} />
                            </Button>
                        </div>
                    ))}
                    {(!menuItems || menuItems.length === 0) && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-3xl">
                            <p className="text-gray-500 font-bold italic uppercase tracking-tighter">NO ITEMS AVAILABLE</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="sticky top-28 space-y-6">
                    <h2 className="text-2xl font-bold flex items-center gap-2 italic uppercase tracking-tighter">
                        <ShoppingCart size={24} /> Your Cart
                    </h2>
                    <Card className="p-8 space-y-6 bg-white text-black rounded-[3rem]">
                        <div className="space-y-4 max-h-[40vh] overflow-y-auto">
                            {cart.map((item, i) => (
                                <div key={i} className="flex justify-between items-center bg-gray-100 p-4 rounded-2xl">
                                    <div className="space-y-1">
                                        <p className="font-bold">{item.name}</p>
                                        <p className="text-xs font-bold text-gray-500">{item.price} COINS</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => removeFromCart(item.name)} className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg"><Minus size={14} /></button>
                                        <span className="font-black w-4 text-center">{item.quantity}</span>
                                        <button onClick={() => addToCart(item)} className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg"><Plus size={14} /></button>
                                    </div>
                                </div>
                            ))}
                            {cart.length === 0 && (
                                <div className="text-center py-8">
                                    <p className="text-gray-400 font-bold italic uppercase">Cart is empty</p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-200">
                            <div className="flex justify-between items-center uppercase tracking-tighter font-bold text-gray-500">
                                <span>TOTAL AMOUNT</span>
                                <span className="text-3xl text-black tabular-nums tracking-tighter">{totalAmount} COINS</span>
                            </div>
                            <Button 
                                onClick={handlePlaceOrder}
                                disabled={cart.length === 0 || orderLoading}
                                className="w-full h-14 bg-black text-white hover:bg-gray-800 disabled:opacity-20"
                            >
                                {orderLoading ? 'Processing...' : user ? 'Checkout Now' : 'Login to Order'}
                            </Button>
                        </div>
                    </Card>
                    {user && (
                        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex justify-between items-center italic">
                            <span className="text-gray-500 font-bold text-xs uppercase tracking-widest">Available Wallet balance</span>
                            <span className="text-xl font-black tabular-nums tracking-tighter">{user.wallet?.balance || 50} COINS</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Menu;
