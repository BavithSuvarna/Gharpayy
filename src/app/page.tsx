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
                <div className="glass-panel p-6 rounded-2xl border border-gray-800">
                    <h2 className="text-xl font-semibold text-white mb-4 border-b border-gray-800 pb-3">Pipeline Funnel</h2>
                    <div className="space-y-4 pt-2">
                        {Object.keys(stats.pipelineCounts).length > 0 ? Object.entries(stats.pipelineCounts).map(([stage, count]) => (
                            <div key={stage} className="flex items-center justify-between bg-white/5 p-3 rounded-xl">
                                <span className="text-gray-300 font-medium">{stage.replace(/_/g, ' ')}</span>
                                <span className="bg-indigo-500/20 text-indigo-300 font-bold px-3 py-1 rounded-full text-sm">{count as number}</span>
                            </div>
                        )) : (
                            <p className="text-gray-500 text-sm text-center py-4 bg-white/5 rounded-xl border border-dashed border-gray-700">No leads in the pipeline currently.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, critical = false }: { title: string, value: number, icon: any, critical?: boolean }) {
    return (
        <div className={`glass-panel p-6 rounded-2xl flex items-center justify-between transition-all ${critical ? 'ring-2 ring-red-500/50 bg-red-500/5' : 'border border-gray-800'}`}>
            <div>
                <p className="text-sm font-medium text-gray-400">{title}</p>
                <p className={`text-3xl font-bold mt-2 ${critical ? 'text-red-400' : 'text-white'}`}>{value}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                {icon}
            </div>
        </div>
    );
}
