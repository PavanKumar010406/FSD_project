import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../../services/api';
import { Card, Button, Input } from '../../components/common';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList, CheckCircle, Package, Clock, Utensils, Plus, AlertCircle, XCircle } from 'lucide-react';

const InstitutionAdminDashboard = () => {
    const { user } = useAuth();
    const [institution, setInstitution] = useState(null);
    const [loading, setLoading] = useState(true);

    // Form states for Create Institution
    const [instName, setInstName] = useState('');
    const [instDesc, setInstDesc] = useState('');

    // Form states for Add Food Item
    const [foodName, setFoodName] = useState('');
    const [foodPrice, setFoodPrice] = useState('');
    const [foodCategory, setFoodCategory] = useState('');
    
    // Menu items
    const [menuItems, setMenuItems] = useState([]);
    
    // UI states
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        fetchInstitution();
    }, []);

    const fetchInstitution = async () => {
        try {
            setLoading(true);
            const res = await API.get('/institutions/my');
            setInstitution(res.data);
            if (res.data.status === 'Approved') {
                fetchMenu(res.data._id);
            }
        } catch (error) {
            if (error.response?.status === 404) {
                setInstitution(null);
            } else {
                console.error('Error fetching institution:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchMenu = async (institutionId) => {
        try {
            const res = await API.get(`/menu/${institutionId}`);
            setMenuItems(res.data);
        } catch (error) {
            console.error('Error fetching menu:', error);
        }
    };

    const handleCreateInstitution = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/institutions', { name: instName, description: instDesc });
            setInstitution(res.data);
            setSuccessMsg('Institution created successfully! Waiting for approval.');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Error creating institution');
            setTimeout(() => setErrorMsg(''), 3000);
        }
    };

    const handleAddFoodItem = async (e) => {
        e.preventDefault();
        try {
            const res = await API.post('/menu', {
                name: foodName,
                price: Number(foodPrice),
                category: foodCategory
            });
            setMenuItems([...menuItems, res.data]);
            setFoodName('');
            setFoodPrice('');
            setFoodCategory('');
            setSuccessMsg('Food item added successfully!');
            setTimeout(() => setSuccessMsg(''), 3000);
        } catch (error) {
            setErrorMsg(error.response?.data?.message || 'Error adding food item');
            setTimeout(() => setErrorMsg(''), 3000);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin"></div>
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="max-w-6xl mx-auto py-10 px-4 min-h-screen bg-gray-950 text-white"
        >
            <AnimatePresence>
                {successMsg && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-4 p-4 bg-green-500/10 border border-green-500/20 text-green-500 rounded-lg text-center font-medium"
                    >
                        {successMsg}
                    </motion.div>
                )}
                {errorMsg && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-center font-medium"
                    >
                        {errorMsg}
                    </motion.div>
                )}
            </AnimatePresence>

            {!institution && (
                <motion.div 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    className="max-w-md mx-auto"
                >
                    <Card className="p-8 bg-gray-900 border border-gray-700 rounded-2xl">
                        <h2 className="text-2xl font-bold mb-6 text-center">Create Institution</h2>
                        <form onSubmit={handleCreateInstitution} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Institution Name</label>
                                <Input 
                                    value={instName} 
                                    onChange={(e) => setInstName(e.target.value)} 
                                    required 
                                    placeholder="Enter name"
                                    className="w-full bg-gray-800 border-gray-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <Input 
                                    value={instDesc} 
                                    onChange={(e) => setInstDesc(e.target.value)} 
                                    required 
                                    placeholder="Brief description"
                                    className="w-full bg-gray-800 border-gray-700"
                                />
                            </div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button type="submit" className="w-full mt-4">Submit Request</Button>
                            </motion.div>
                        </form>
                    </Card>
                </motion.div>
            )}

            {institution?.status === 'Pending' && (
                <motion.div 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    className="flex flex-col items-center justify-center min-h-[50vh] max-w-md mx-auto"
                >
                    <Card className="p-8 text-center bg-gray-900 border border-gray-700 rounded-2xl w-full">
                        <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-yellow-500" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Under Review</h2>
                        <p className="text-gray-400">
                            Your institution request is under review. Please wait until it is approved.
                        </p>
                    </Card>
                </motion.div>
            )}

            {institution?.status === 'Rejected' && (
                <motion.div 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    className="flex flex-col items-center justify-center min-h-[50vh] max-w-md mx-auto"
                >
                    <Card className="p-8 text-center bg-gray-900 border border-gray-700 rounded-2xl w-full">
                        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <XCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2 text-white">Request Rejected</h2>
                        <p className="text-gray-400">
                            Your request was rejected. Contact admin.
                        </p>
                    </Card>
                </motion.div>
            )}

            {institution?.status === 'Approved' && (
                <motion.div 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    className="space-y-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold">{institution.name}</h1>
                            <p className="text-gray-400">Manage your menu items</p>
                        </div>
                        <div className="px-4 py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-sm font-bold flex items-center gap-2">
                            <CheckCircle size={16} /> APPROVED
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Add Food Item Form */}
                        <div className="md:col-span-1">
                            <Card className="p-6 bg-gray-900 border border-gray-700 rounded-2xl sticky top-8">
                                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Plus size={20} /> Add Food Item
                                </h2>
                                <form onSubmit={handleAddFoodItem} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                                        <Input 
                                            value={foodName} 
                                            onChange={(e) => setFoodName(e.target.value)} 
                                            required 
                                            placeholder="Item name"
                                            className="w-full bg-gray-800 border-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Price ($)</label>
                                        <Input 
                                            type="number"
                                            value={foodPrice} 
                                            onChange={(e) => setFoodPrice(e.target.value)} 
                                            required 
                                            min="0"
                                            step="0.01"
                                            placeholder="0.00"
                                            className="w-full bg-gray-800 border-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                                        <Input 
                                            value={foodCategory} 
                                            onChange={(e) => setFoodCategory(e.target.value)} 
                                            required 
                                            placeholder="e.g. Beverages, Mains"
                                            className="w-full bg-gray-800 border-gray-700"
                                        />
                                    </div>
                                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                        <Button type="submit" className="w-full mt-2">Add Product</Button>
                                    </motion.div>
                                </form>
                            </Card>
                        </div>

                        {/* Menu Items List */}
                        <div className="md:col-span-2 space-y-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <Utensils size={20} /> Current Menu
                            </h2>
                            {menuItems.length === 0 ? (
                                <div className="p-8 text-center border-2 border-dashed border-gray-800 rounded-2xl text-gray-500">
                                    No items in your menu yet. Add some!
                                </div>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-4">
                                    {menuItems.map((item) => (
                                        <motion.div 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            key={item._id} 
                                        >
                                            <Card className="p-4 bg-gray-900 border border-gray-700 rounded-2xl hover:border-gray-600 transition flex justify-between items-center">
                                                <div>
                                                    <h3 className="font-bold text-lg">{item.name}</h3>
                                                    <span className="text-xs text-gray-400 uppercase tracking-wider">{item.category}</span>
                                                </div>
                                                <div className="text-xl font-black tabular-nums">
                                                    ${item.price.toFixed(2)}
                                                </div>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
};

export default InstitutionAdminDashboard;
