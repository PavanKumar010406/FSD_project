import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Input, Button } from '../components/common';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        role: 'User'
    });
    const [error, setError] = useState('');
    const { user, register } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user) {
            if (user.role === 'User') navigate('/explore');
            else if (user.role === 'InstitutionAdmin') navigate('/institution-admin');
            else if (user.role === 'PlatformAdmin') navigate('/admin');
            else navigate('/explore');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await register(formData);
            if (data.role === 'User') navigate('/explore');
            else if (data.role === 'InstitutionAdmin') navigate('/institution-admin');
            else if (data.role === 'PlatformAdmin') navigate('/admin');
            else navigate('/explore');
        } catch (err) {
            setError(err.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] py-12 px-4">
            <Card className="w-full max-w-lg p-10 space-y-8 bg-gray-900/50 backdrop-blur-xl">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black italic tracking-tighter uppercase">START YOUR JOURNEY</h2>
                    <p className="text-gray-400 font-medium">Create your Campus Eats account today</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">{error}</div>}
                    
                    <div className="grid md:grid-cols-2 gap-4">
                        <Input 
                            label="Full Name" 
                            placeholder="John Doe" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required
                        />
                        <Input 
                            label="Mobile Number" 
                            placeholder="1234567890" 
                            value={formData.mobile}
                            onChange={(e) => setFormData({...formData, mobile: e.target.value})}
                            required
                        />
                    </div>

                    <Input 
                        label="Email Address" 
                        type="email" 
                        placeholder="your@campus.edu" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                    />
                    
                    <Input 
                        label="Password" 
                        type="password" 
                        placeholder="••••••••" 
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                    />

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-400">Join as</label>
                        <select 
                            className="input-field appearance-none"
                            value={formData.role}
                            onChange={(e) => setFormData({...formData, role: e.target.value})}
                        >
                            <option value="User">Student / Regular User</option>
                            <option value="InstitutionAdmin">Institution Partner</option>
                        </select>
                    </div>

                    <div className="bg-gray-800/50 p-4 rounded-xl border border-gray-700/50">
                        <p className="text-xs text-gray-400 font-medium text-center">
                            New users get <span className="text-white font-bold">50 COINS</span> for free upon registration.
                        </p>
                    </div>

                    <Button type="submit" className="w-full h-14 text-lg">Create Account</Button>
                </form>

                <p className="text-center text-sm text-gray-400">
                    Already have an account? <Link to="/login" className="text-white font-bold hover:underline">Sign In</Link>
                </p>
            </Card>
        </div>
    );
};

export default Register;
