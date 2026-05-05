import React from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Zap, ShieldCheck, Wallet } from 'lucide-react';
import { Button } from '../components/common';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (user) {
            if (user.role === 'User') navigate('/explore');
            else if (user.role === 'InstitutionAdmin') navigate('/institution-admin');
            else if (user.role === 'PlatformAdmin') navigate('/admin');
            else navigate('/explore');
        }
    }, [user, navigate]);

    return (
        <div className="space-y-24 py-12">
            {/* Hero Section */}
            <section className="text-center space-y-8 max-w-4xl mx-auto px-4">
                <motion.h1 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-6xl md:text-8xl font-black tracking-tight leading-none"
                >
                    CAMPUS <span className="text-gray-500">EATS</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-gray-400 font-medium max-w-2xl mx-auto"
                >
                    The modern food ordering system for your campus. Fast, secure, and entirely coin-based.
                </motion.p>
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center justify-center gap-4"
                >
                    <Link to="/explore">
                        <Button className="h-14 px-10 text-lg">Order Now</Button>
                    </Link>
                    <Link to="/register">
                        <Button variant="secondary" className="h-14 px-10 text-lg">Join as Partner</Button>
                    </Link>
                </motion.div>
            </section>

            {/* Features Section */}
            <section className="grid md:grid-cols-3 gap-8">
                {[
                    {
                        icon: <Zap className="text-white" size={32} />,
                        title: "Lightning Fast",
                        desc: "Order in seconds and pick up with a secure QR code."
                    },
                    {
                        icon: <Wallet className="text-white" size={32} />,
                        title: "Coin-Based",
                        desc: "No cash, no cards. Use campus coins for all transactions."
                    },
                    {
                        icon: <ShieldCheck className="text-white" size={32} />,
                        title: "Verified Vendors",
                        desc: "Only approved campus institutions can sell on the platform."
                    }
                ].map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="p-8 bg-gray-900 border border-gray-800 rounded-3xl space-y-4 hover:shadow-2xl transition"
                    >
                        <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center">
                            {feature.icon}
                        </div>
                        <h3 className="text-2xl font-bold">{feature.title}</h3>
                        <p className="text-gray-400">{feature.desc}</p>
                    </motion.div>
                ))}
            </section>

            {/* CTA Section */}
            <motion.section 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white text-black p-12 rounded-[3rem] text-center space-y-6"
            >
                <h2 className="text-4xl md:text-5xl font-black">Ready to skip the queue?</h2>
                <p className="text-lg font-medium opacity-70">Join thousands of students ordering today.</p>
                <Link to="/register" className="inline-block">
                    <Button variant="secondary" className="bg-black text-white px-12 h-14">Get Started Free</Button>
                </Link>
            </motion.section>
        </div>
    );
};

export default Home;
