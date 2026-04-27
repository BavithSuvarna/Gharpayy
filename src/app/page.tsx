"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, AlertCircle, Home, CalendarCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await axios.get('/api/dashboard');
            setStats(res.data.data);
        } catch (error) {
            toast.error("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        // Auto-refresh every 30 seconds to catch SLA breaches real-time
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Overview</h1>
                    <p className="text-gray-400 mt-1">Real-time pulse of Gharpayy CRM operations.</p>
                </div>
                <button onClick={fetchStats} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
                    Refresh Data
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Leads" value={stats.totalLeads} icon={<Users className="text-blue-400" />} />

                {/* Important: Highlighting the SLA Breaches */}
                <StatCard
                    title="SLA Breaches (>5m)"
                    value={stats.slaBreaches}
                    icon={<AlertCircle className={stats.slaBreaches > 0 ? "text-red-500 animate-pulse" : "text-green-400"} />}
                    critical={stats.slaBreaches > 0}
                />

                <StatCard title="Total Visits" value={stats.visits.total} icon={<Home className="text-purple-400" />} />
                <StatCard title="Bookings Confirmed" value={stats.bookings} icon={<CalendarCheck className="text-emerald-400" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="glass-panel p-6 rounded-2xl border border-[var(--border)] shadow-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-all duration-700 group-hover:bg-indigo-500/10"></div>
                    <h2 className="text-xl font-semibold text-white mb-4 border-b border-white/5 pb-3 relative z-10">Pipeline Funnel</h2>
                    <div className="space-y-4 pt-2 relative z-10">
                        {Object.keys(stats.pipelineCounts).length > 0 ? Object.entries(stats.pipelineCounts).map(([stage, count], i) => (
                            <div key={stage} className="flex items-center justify-between bg-white/[0.02] hover:bg-white/[0.05] transition-colors p-3.5 rounded-xl border border-white/5 animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                                <span className="text-gray-300 font-medium tracking-wide">{stage.replace(/_/g, ' ')}</span>
                                <span className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 font-bold px-4 py-1 rounded-full text-sm shadow-[0_0_10px_rgba(79,70,229,0.2)]">{count as number}</span>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-sm text-center py-6 bg-white/5 rounded-xl border border-dashed border-gray-700">No leads in the pipeline currently.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, critical = false }: { title: string, value: number, icon: any, critical?: boolean }) {
    return (
        <div className={`glass-panel p-6 rounded-2xl flex items-center justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl relative overflow-hidden group ${critical ? 'ring-2 ring-red-500/50 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'border border-[var(--border)] hover:border-indigo-500/30 hover:shadow-indigo-500/10'}`}>
            <div className={`absolute -right-10 -top-10 w-32 h-32 blur-3xl rounded-full pointer-events-none transition-all duration-500 ${critical ? 'bg-red-500/10 group-hover:bg-red-500/20' : 'bg-indigo-500/5 group-hover:bg-indigo-500/10'}`}></div>
            <div className="relative z-10">
                <p className="text-sm font-medium text-gray-400 tracking-wide">{title}</p>
                <p className={`text-4xl font-bold mt-2 tracking-tight ${critical ? 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]' : 'text-white'}`}>{value}</p>
            </div>
            <div className={`p-3 rounded-xl border relative z-10 shadow-lg ${critical ? 'bg-red-500/10 border-red-500/20' : 'bg-white/[0.03] border-white/10 group-hover:border-indigo-500/30 transition-colors'}`}>
                {icon}
            </div>
        </div>
    );
}
