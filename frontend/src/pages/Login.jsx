import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Input, Button } from '../components/common';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { user, login } = useAuth();
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
            const data = await login(identifier, password);
            if (data.role === 'User') navigate('/explore');
            else if (data.role === 'InstitutionAdmin') navigate('/institution-admin');
            else if (data.role === 'PlatformAdmin') navigate('/admin');
            else navigate('/explore');
        } catch (err) {
            setError(err.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] px-4">
            <Card className="w-full max-w-md p-10 space-y-8 bg-gray-900/50 backdrop-blur-xl">
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-black italic tracking-tighter">WELCOME BACK</h2>
                    <p className="text-gray-400 font-medium">Log in to your Campus Eats account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-sm rounded-xl">{error}</div>}
                    
                    <Input 
                        label="Email or Mobile" 
                        placeholder="your@email.com or 1234567890" 
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                    />
                    
                    <Input 
                        label="Password" 
                        type="password" 
                        placeholder="••••••••" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" className="w-full h-14 text-lg">Sign In</Button>
                </form>

                <p className="text-center text-sm text-gray-400">
                    Don't have an account? <Link to="/register" className="text-white font-bold hover:underline">Register</Link>
                </p>
            </Card>
        </div>
    );
};

export default Login;
