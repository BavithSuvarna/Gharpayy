"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Phone, MapPin, Search } from 'lucide-react';
import Link from 'next/link';

export default function LeadDirectory() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        axios.get('/api/leads').then(res => {
            setLeads(res.data.data);
            setLoading(false);
        });
    }, []);

    const filtered = leads.filter(l => l.name.toLowerCase().includes(search.toLowerCase()) || l.phone.includes(search));

    if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Lead Directory</h1>
                    <p className="text-gray-400 mt-1">Global view of all historic and active leads.</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-[#0f172a]/80 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(lead => (
                    <Link href={`/leads/${lead.id}`} key={lead.id}>
                        <div className="glass-panel p-5 rounded-2xl hover:border-indigo-500/50 transition-all group cursor-pointer border border-gray-800 bg-[#1e293b]/60 h-full">
                            <div className="flex justify-between items-start">
                                <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{lead.name}</h3>
                                <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2 py-1 rounded-full font-medium">{lead.status.replace(/_/g, ' ')}</span>
                            </div>
                            <div className="mt-4 space-y-3 text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <span>{lead.phone}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-gray-500" />
                                    <span>{lead.source}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <span>Owner: <strong className="text-gray-300">{lead.agent?.name || 'Unassigned'}</strong></span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
