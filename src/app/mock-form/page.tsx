"use client";

import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Send } from 'lucide-react';

export default function MockForm() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        source: 'Website Form'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await axios.post('/api/leads', formData);
            toast.success(res.data.message || 'Lead correctly captured and assigned!');
            setFormData({ name: '', phone: '', source: 'Website Form' });
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to capture lead');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 p-8 glass-panel rounded-3xl border border-white/10">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Simulate Incoming Lead</h1>
                <p className="text-gray-400 text-sm">
                    This form simulates a webhook payload from WhatsApp, Instagram, or the Website.
                    Submit it, then check the Dashboard or Pipeline to verify assignment SLA tracking.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Customer Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-[#0f172a]/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                        placeholder="John Doe"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                    <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-[#0f172a]/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                        placeholder="+91 98765 43210"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Lead Source</label>
                    <select
                        value={formData.source}
                        onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                        className="w-full bg-[#0f172a]/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                    >
                        <option>Website Form</option>
                        <option>WhatsApp Direct</option>
                        <option>Instagram DM</option>
                        <option>Incoming Call</option>
                    </select>
                </div>

                <button
                    disabled={loading}
                    type="submit"
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium tracking-wide flex items-center justify-center gap-2 transition disabled:opacity-50"
                >
                    {loading ? 'Processing Webhook...' : 'Fire Mock Webhook'}
                    {!loading && <Send className="w-5 h-5" />}
                </button>
            </form>
        </div>
    );
}
