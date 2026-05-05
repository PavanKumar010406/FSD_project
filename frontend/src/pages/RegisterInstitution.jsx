import React, { useState } from 'react';
import { motion } from 'framer-motion';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button } from '../components/common';
import { Store, MapPin, ClipboardList } from 'lucide-react';

const RegisterInstitution = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        location: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await API.post('/institution/register', formData);
            navigate('/institution-admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] py-12 px-4">
            <Card className="w-full max-w-2xl p-12 space-y-10 bg-gray-900/50 backdrop-blur-xl">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gray-800 rounded-3xl mx-auto flex items-center justify-center">
                        <Store size={40} />
                    </div>
                    <h2 className="text-4xl font-black italic tracking-tighter uppercase">PARTNER REGISTRATION</h2>
                    <p className="text-gray-400 font-medium">Apply to join the Campus Eats network as a verified vendor.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">{error}</div>}
                    
                    <div className="space-y-6">
                        <Input 
                            label="Institution Name" 
                            placeholder="Campus Cafe, Student Union Grille, etc." 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />

                        <Input 
                            label="Location" 
                            placeholder="Main Library, Ground Floor / Block A Cafeteria" 
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            required
                        />

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-400">Description</label>
                            <textarea 
                                className="input-field min-h-[120px] resize-none"
                                placeholder="Briefly describe what you offer (e.g., Healthy snacks, Coffee and Pastries)..."
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="bg-white text-black p-8 rounded-3xl space-y-2">
                        <div className="flex items-center gap-2 font-black italic tracking-tighter text-xl">
                            <ClipboardList size={20} /> APPROVAL PROCESS
                        </div>
                        <p className="text-sm font-medium opacity-70">
                            Your application will be reviewed by the Platform Admin. You'll receive notification once approved.
                        </p>
                    </div>

                    <Button type="submit" disabled={loading} className="w-full h-16 text-xl">
                        {loading ? 'Submitting Application...' : 'Apply as Partner'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default RegisterInstitution;
