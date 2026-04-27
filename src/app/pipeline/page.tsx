"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { User } from 'lucide-react';
import toast from 'react-hot-toast';

const STAGES = [
    'NEW', 'CONTACTED', 'REQUIREMENT_COLLECTED', 'PROPERTY_SUGGESTED',
    'VISIT_SCHEDULED', 'VISIT_COMPLETED', 'BOOKED', 'LOST'
];

export default function Pipeline() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLeads = async () => {
        try {
            const res = await axios.get('/api/leads');
            setLeads(res.data.data);
        } catch (error) {
            toast.error('Failed to load leads');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLeads();
    }, []);

    const moveLead = async (leadId: string, currentStage: string, direction: 'forward' | 'backward') => {
        const currentIndex = STAGES.indexOf(currentStage);
        const newIndex = direction === 'forward' ? currentIndex + 1 : currentIndex - 1;

        if (newIndex < 0 || newIndex >= STAGES.length) return;
        const newStatus = STAGES[newIndex];

        try {
            // Optimistic update
            setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
            await axios.patch(`/api/leads/${leadId}/status`, { status: newStatus });
            toast.success(`Moved to ${newStatus}`);
        } catch (error) {
            toast.error('Failed to update status');
            fetchLeads(); // revert
        }
    };

    if (loading) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div></div>;

    return (
        <div className="h-full flex flex-col pl-2">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-white tracking-tight">Active Pipeline</h1>
                <p className="text-gray-400 mt-1">Manage leads through the conversion funnel.</p>
            </div>

            <div className="flex-1 flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                {STAGES.map(stage => {
                    const stageLeads = leads.filter(l => l.status === stage);
                    return (
                        <div key={stage} className="flex-shrink-0 w-[320px] flex flex-col h-[calc(100vh-140px)] glass-panel rounded-2xl overflow-hidden border border-white/[0.05] shadow-2xl relative group/column">
                            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover/column:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                            <div className="p-4 border-b border-white/10 bg-white/[0.02] backdrop-blur-md flex justify-between items-center z-10 relative">
                                <span className="font-bold text-gray-200 text-sm tracking-wider">
                                    {stage.replace(/_/g, ' ')}
                                </span>
                                <span className="bg-indigo-500/20 border border-indigo-500/30 shadow-[0_0_8px_rgba(79,70,229,0.3)] text-indigo-300 font-bold text-xs px-2.5 py-1 rounded-full">{stageLeads.length}</span>
                            </div>

                            <div className="p-3 flex-1 overflow-y-auto space-y-3 relative z-10">
                                {stageLeads.map((lead, i) => (
                                    <div key={lead.id} className="p-4 rounded-xl transition-all duration-300 hover:-translate-y-1 group shadow-lg bg-[#0f172a]/80 border border-white/5 hover:border-indigo-500/40 hover:shadow-[0_8px_20px_rgba(79,70,229,0.15)] animate-fade-in-up relative overflow-hidden" style={{ animationDelay: `${i * 0.05}s` }}>
                                        <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-xl rounded-full -mr-10 -mt-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        <div className="flex justify-between items-start mb-2 relative z-10">
                                            <h3 className="text-white font-medium text-sm truncate pr-2 group-hover:text-indigo-200 transition-colors">{lead.name}</h3>
                                            <span className="text-[10px] text-gray-500 whitespace-nowrap uppercase tracking-wider font-semibold">{new Date(lead.createdAt).toLocaleDateString()}</span>
                                        </div>

                                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400 relative z-10">
                                            <User className="w-3.5 h-3.5 text-indigo-400" />
                                            <span className="truncate">{lead.agent?.name || 'Unassigned'}</span>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-white/5 flex gap-2 relative z-10 opacity-70 group-hover:opacity-100 transition-opacity">
                                            <button
                                                disabled={STAGES.indexOf(stage) === 0}
                                                onClick={() => moveLead(lead.id, stage, 'backward')}
                                                className="flex-1 py-1.5 bg-white/[0.03] hover:bg-white/[0.08] rounded-lg text-[11px] font-semibold text-gray-300 transition-all disabled:opacity-20 disabled:hover:bg-white/[0.03] cursor-pointer disabled:cursor-not-allowed uppercase tracking-wider"
                                            >
                                                Prev
                                            </button>
                                            <button
                                                disabled={STAGES.indexOf(stage) === STAGES.length - 1}
                                                onClick={() => moveLead(lead.id, stage, 'forward')}
                                                className="flex-1 py-1.5 bg-indigo-500/20 border border-indigo-500/30 hover:bg-indigo-500/30 hover:shadow-[0_0_10px_rgba(79,70,229,0.3)] rounded-lg text-[11px] font-semibold text-indigo-300 transition-all disabled:opacity-20 disabled:hover:bg-indigo-500/20 disabled:border-transparent cursor-pointer disabled:cursor-not-allowed uppercase tracking-wider"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
