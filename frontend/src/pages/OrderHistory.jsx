import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../services/api';
import { Card, Button } from '../components/common';
import { ShoppingBag, CheckCircle, Clock, Package, QrCode } from 'lucide-react';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await API.get('/order/my');
                setOrders(data);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Completed': return 'text-green-500 bg-green-500/10 border-green-500/20';
            case 'Ready': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
            case 'Preparing': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
            default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-12 py-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">MY ORDERS</h1>
                <p className="text-gray-400 font-medium">Track your recent orders and manage your pick-ups.</p>
            </div>

            <div className="grid gap-8">
                {orders.map((order) => (
                    <Card key={order._id} className="p-8 space-y-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">ORDER FROM</p>
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter">{order.institutionId?.name || 'Unknown Institution'}</h3>
                                <p className="text-xs text-gray-400">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                            <div className={`px-4 py-2 rounded-full border text-sm font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                                {order.status}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                            <div className="flex-1 space-y-4">
                                <div className="space-y-2">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">ORDER ITEMS</p>
                                    <div className="space-y-3">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="flex justify-between items-center bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-8 h-8 bg-black text-white flex items-center justify-center rounded-lg font-bold text-xs">{item.quantity}x</span>
                                                    <span className="font-medium">{item.name}</span>
                                                </div>
                                                <span className="font-bold tabular-nums">{item.price * item.quantity} COINS</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                                    <span className="text-lg font-bold text-gray-400 uppercase tracking-tighter italic">TOTAL AMOUNT</span>
                                    <span className="text-3xl font-black tabular-nums tracking-tighter">{order.totalAmount} COINS</span>
                                </div>
                            </div>

                            <div className="w-full md:w-48 flex flex-col items-center justify-center p-6 bg-white rounded-3xl space-y-3">
                                {order.status === 'Ready' || order.status === 'Completed' ? (
                                    <>
                                        <div className="w-32 h-32 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-black border-dashed">
                                            <QrCode size={64} className="text-black" />
                                        </div>
                                        <p className="text-black font-black text-xs uppercase tracking-widest text-center">SCAN TO PICKUP</p>
                                    </>
                                ) : (
                                    <div className="text-center space-y-2 py-4">
                                        <Clock className="text-black mx-auto" size={32} />
                                        <p className="text-black font-black text-xs uppercase tracking-widest">PREPARING...</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}

                {orders.length === 0 && (
                    <div className="text-center py-20 bg-gray-900 border border-dashed border-gray-800 rounded-[3rem]">
                        <ShoppingBag className="mx-auto text-gray-700 mb-6" size={64} />
                        <p className="text-2xl font-black italic uppercase text-gray-500">NO ORDERS FOUND</p>
                        <p className="text-gray-600 mb-8 max-w-sm mx-auto font-medium">You haven't placed any orders yet. Visit the directory and start eating!</p>
                        <Button onClick={() => window.location.href='/institutions'} className="h-14 px-12">Browse Restaurants</Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;
