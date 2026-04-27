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
                <div className="relative w-full md:w-96 group">
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-xl blur-lg transition-all opacity-0 group-focus-within:opacity-100"></div>
                    <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500 z-10" />
                    <input
                        type="text"
                        placeholder="Search by name or phone..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="relative w-full bg-[#0f172a]/80 backdrop-blur-md border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all shadow-[0_0_15px_rgba(0,0,0,0.2)]"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((lead, i) => (
                    <Link href={`/leads/${lead.id}`} key={lead.id} className="animate-fade-in-up" style={{ animationDelay: `${i * 0.05}s` }}>
                        <div className="glass-panel p-5 rounded-2xl hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 group cursor-pointer border border-white/5 bg-[#0f172a]/60 h-full relative overflow-hidden shadow-lg hover:shadow-[0_8px_30px_rgba(79,70,229,0.15)]">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-2xl rounded-full -mr-10 -mt-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="flex justify-between items-start relative z-10">
                                <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors tracking-wide">{lead.name}</h3>
                                <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full border shadow-sm ${
                                    lead.status === 'NEW' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                    lead.status === 'BOOKED' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                                    lead.status === 'LOST' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                                    'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                }`}>
                                    {lead.status.replace(/_/g, ' ')}
                                </span>
                            </div>
                            <div className="mt-5 space-y-3 text-sm text-gray-400 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/5 group-hover:bg-indigo-500/10 transition-colors">
                                        <Phone className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-300" />
                                    </div>
                                    <span className="font-medium tracking-wide text-gray-300">{lead.phone}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/5 group-hover:bg-indigo-500/10 transition-colors">
                                        <MapPin className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-300" />
                                    </div>
                                    <span className="font-medium tracking-wide text-gray-300">{lead.source}</span>
                                </div>
                                <div className="flex items-center gap-3 pt-2 mt-2 border-t border-white/5">
                                    <div className="p-1.5 rounded-lg bg-white/[0.03] border border-white/5 group-hover:bg-indigo-500/10 transition-colors">
                                        <User className="w-3.5 h-3.5 text-gray-400 group-hover:text-indigo-300" />
                                    </div>
                                    <span className="text-xs">Owner: <strong className="text-white font-semibold">{lead.agent?.name || 'Unassigned'}</strong></span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
