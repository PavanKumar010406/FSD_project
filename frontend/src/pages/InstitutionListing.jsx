import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../services/api';
import { Card, Button } from '../components/common';
import { MapPin, Search } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const InstitutionListing = () => {
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                const { data } = await API.get('/institutions');
                setInstitutions(data);
            } catch (error) {
                console.error('Error fetching institutions:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchInstitutions();
    }, []);

    const filteredInstitutions = institutions.filter(inst => 
        inst.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-12 py-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">RESTAURANT DIRECTORY</h1>
                <p className="text-gray-400 font-medium">Explore and order from your favorite campus spots.</p>
            </div>

            <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="text-gray-500" size={20} />
                </div>
                <input 
                    type="text" 
                    placeholder="Search for food, snacks, or restaurants..." 
                    className="w-full bg-gray-900 border border-gray-800 rounded-2xl h-14 pl-12 pr-4 focus:outline-none focus:border-white transition-all text-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredInstitutions.map((inst, i) => (
                    <Card key={inst._id} className="group overflow-hidden">
                        <div className="h-48 bg-gray-800 relative -mx-6 -mt-6 mb-6 overflow-hidden">
                            {/* Placeholder/Mock Image */}
                            <img 
                                src={`https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D`} 
                                alt={inst.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-500 opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 to-transparent"></div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold">{inst.name}</h3>
                            <div className="flex items-center gap-2 text-gray-400 text-sm">
                                <MapPin size={16} />
                                <span>{inst.location || 'Campus Center'}</span>
                            </div>
                            <p className="text-gray-400 text-sm line-clamp-2">{inst.description}</p>
                            <Button className="w-full h-12" onClick={() => navigate('/explore/' + inst._id)}>View Menu</Button>
                        </div>
                    </Card>
                ))}
            </div>

            {filteredInstitutions.length === 0 && (
                <div className="text-center py-20 space-y-4">
                    <p className="text-gray-500 text-xl font-bold italic uppercase">NO RESULTS FOUND</p>
                    <p className="text-gray-600">Try searching with a different keyword.</p>
                </div>
            )}
        </div>
    );
};

export default InstitutionListing;
