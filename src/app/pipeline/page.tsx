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
                        <div key={stage} className="flex-shrink-0 w-[320px] flex flex-col h-[calc(100vh-140px)] bg-[#0f172a]/60 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden">
                            <div className="p-4 border-b border-white/5 bg-[#0f172a] shadow-sm flex justify-between items-center z-10">
                                <span className="font-bold text-gray-200 text-sm tracking-wider">
                                    {stage.replace(/_/g, ' ')}
                                </span>
                                <span className="bg-indigo-500/20 text-indigo-300 font-bold text-xs px-2.5 py-1 rounded-full">{stageLeads.length}</span>
                            </div>

                            <div className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                                {stageLeads.map(lead => (
                                    <div key={lead.id} className="glass-panel p-4 rounded-xl hover:border-indigo-500/50 transition-all group shadow-sm bg-[#1e293b]/80 border border-gray-700/50">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-white font-medium text-sm truncate pr-2">{lead.name}</h3>
                                            <span className="text-xs text-gray-500 whitespace-nowrap">{new Date(lead.createdAt).toLocaleDateString()}</span>
                                        </div>

                                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-400 object-contain">
                                            <User className="w-3 h-3" />
                                            <span className="truncate">{lead.agent?.name || 'Unassigned'}</span>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-gray-700/50 flex gap-2">
                                            <button
                                                disabled={STAGES.indexOf(stage) === 0}
                                                onClick={() => moveLead(lead.id, stage, 'backward')}
                                                className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium text-gray-300 transition disabled:opacity-30 disabled:hover:bg-white/5 cursor-pointer disabled:cursor-not-allowed"
                                            >
                                                Prev
                                            </button>
                                            <button
                                                disabled={STAGES.indexOf(stage) === STAGES.length - 1}
                                                onClick={() => moveLead(lead.id, stage, 'forward')}
                                                className="flex-1 py-1.5 bg-indigo-500/20 hover:bg-indigo-500/30 rounded-lg text-xs font-medium text-indigo-300 transition disabled:opacity-30 disabled:hover:bg-indigo-500/20 cursor-pointer disabled:cursor-not-allowed"
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
