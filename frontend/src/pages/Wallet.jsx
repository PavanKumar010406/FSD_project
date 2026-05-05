import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../services/api';
import { Card } from '../components/common';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';

const Wallet = () => {
    const [balance, setBalance] = useState(0);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                const [balanceRes, historyRes] = await Promise.all([
                    API.get('/wallet/balance'),
                    API.get('/wallet/history')
                ]);
                setBalance(balanceRes.data.balance);
                setHistory(historyRes.data);
            } catch (error) {
                console.error('Error fetching wallet data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchWalletData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-white rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-12 py-8 max-w-4xl mx-auto">
            <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic">MY WALLET</h1>
                <p className="text-gray-400 font-medium">Manage your campus coins and view transactions.</p>
            </div>

            <Card className="bg-white text-black p-12 text-center space-y-4 rounded-[3rem]">
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center">
                        <WalletIcon size={40} />
                    </div>
                </div>
                <p className="text-sm font-bold uppercase tracking-widest text-gray-500">AVAILABLE BALANCE</p>
                <div className="text-7xl font-black tabular-nums tracking-tighter">
                    {balance} <span className="text-gray-400">COINS</span>
                </div>
            </Card>

            <div className="space-y-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 italic uppercase tracking-tighter">
                    <Clock size={24} /> TRANSACTION HISTORY
                </h2>
                
                <div className="space-y-4">
                    {history.map((tx) => (
                        <div 
                            key={tx._id}
                            className="bg-gray-900 border border-gray-800 p-6 rounded-2xl flex items-center justify-between hover:border-gray-700 transition"
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                    tx.type === 'Debit' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'
                                }`}>
                                    {tx.type === 'Debit' ? <ArrowUpRight size={24} /> : <ArrowDownLeft size={24} />}
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-lg">{tx.description || (tx.type === 'Debit' ? 'Withdrawal' : 'Deposit')}</p>
                                    <p className="text-gray-500 text-sm font-medium">
                                        {new Date(tx.createdAt).toLocaleDateString(undefined, { 
                                            day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                                        })}
                                    </p>
                                </div>
                            </div>
                            <div className={`text-2xl font-black tabular-nums ${
                                tx.type === 'Debit' ? 'text-red-500' : 'text-green-500'
                            }`}>
                                {tx.type === 'Debit' ? '-' : '+'}{tx.amount}
                            </div>
                        </div>
                    ))}

                    {history.length === 0 && (
                        <div className="text-center py-12 border-2 border-dashed border-gray-800 rounded-3xl">
                            <p className="text-gray-500 font-bold italic uppercase tracking-tighter">NO TRANSACTIONS YET</p>
                            <p className="text-gray-600">Your recent activity will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Wallet;
