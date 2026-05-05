import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../../services/api';
import { Card, Button } from '../../components/common';
import { ShieldCheck, CheckCircle, XCircle, Clock, MapPin } from 'lucide-react';

const PlatformAdminDashboard = () => {
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInstitutions();
    }, []);

    const fetchInstitutions = async () => {
        try {
            const { data } = await API.get('/institution/all');
            setInstitutions(data);
        } catch (error) {
            console.error('Error fetching institutions:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await API.put(`/institution/${id}/status`, { status });
            fetchInstitutions();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin"></div>
        </div>
    );

    const pending = institutions.filter(i => i.status === 'Pending');
    const others = institutions.filter(i => i.status !== 'Pending');

    return (
        <div className="space-y-12 py-8 max-w-6xl mx-auto">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic flex items-center justify-center gap-4">
                    <ShieldCheck size={48} className="text-gray-500" /> PLATFORM CONTROL
                </h1>
                <p className="text-gray-400 font-medium">Manage and verify campus institutions.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Institutions", value: institutions.length, icon: <ShieldCheck /> },
                    { label: "Pending Approval", value: pending.length, icon: <Clock /> },
                    { label: "Approved Partners", value: institutions.filter(i => i.status === 'Approved').length, icon: <CheckCircle /> },
                    { label: "Rejected Partners", value: institutions.filter(i => i.status === 'Rejected').length, icon: <XCircle /> }
                ].map((stat, i) => (
                    <Card key={i} className="p-6 bg-gray-900 border-gray-800 space-y-3">
                        <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-gray-400">
                            {stat.icon}
                        </div>
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
                        <h3 className="text-4xl font-black tabular-nums tracking-tighter">{stat.value}</h3>
                    </Card>
                ))}
            </div>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold uppercase tracking-tighter italic">Pending Applications</h2>
                <div className="grid gap-6">
                    {pending.map((inst) => (
                        <div 
                            key={inst._id}
                            className="bg-gray-900 border border-gray-800 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-8 hover:border-gray-700 transition"
                        >
                            <div className="space-y-3">
                                <h3 className="text-3xl font-black uppercase tracking-tighter italic tabular-nums">{inst.name}</h3>
                                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                    <MapPin size={16} /> {inst.location}
                                </div>
                                <p className="text-gray-400 max-w-xl">{inst.description}</p>
                            </div>
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <Button 
                                    variant="secondary" 
                                    className="flex-1 md:flex-none border-red-500/20 text-red-500 hover:bg-red-500/10"
                                    onClick={() => handleStatusUpdate(inst._id, 'Rejected')}
                                >
                                    Reject
                                </Button>
                                <Button 
                                    className="flex-1 md:flex-none"
                                    onClick={() => handleStatusUpdate(inst._id, 'Approved')}
                                >
                                    Approve Partner
                                </Button>
                            </div>
                        </div>
                    ))}
                    {pending.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-3xl">
                            <p className="text-gray-500 font-bold italic uppercase tracking-tighter">NO PENDING APPLICATIONS</p>
                        </div>
                    )}
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-bold uppercase tracking-tighter italic">Verified Partners</h2>
                <div className="grid gap-4">
                    {others.map((inst) => (
                        <div 
                            key={inst._id}
                            className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-center justify-between"
                        >
                            <div className="space-y-1">
                                <h4 className="font-bold text-xl">{inst.name}</h4>
                                <p className="text-sm text-gray-500 font-medium">{inst.location}</p>
                            </div>
                            <div className={`px-4 py-1.5 rounded-full border text-xs font-black uppercase tracking-widest ${
                                inst.status === 'Approved' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
                            }`}>
                                {inst.status}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default PlatformAdminDashboard;
