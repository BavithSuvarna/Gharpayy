"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import { User, Phone, MapPin, Clock, Calendar, MessageSquare, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LeadProfile({ params }: { params: { id: string } }) {
    const [lead, setLead] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [replyText, setReplyText] = useState('');
    const [visitData, setVisitData] = useState({ property: '', date: '' });
    const [showSchedule, setShowSchedule] = useState(false);

    const fetchLead = async () => {
        try {
            const res = await axios.get(`/api/leads/${params.id}`);
            setLead(res.data.data);
        } catch {
            toast.error('Failed to load lead profile');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLead();
    }, [params.id]);

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText) return;
        try {
            await axios.post('/api/conversations', {
                leadId: lead.id,
                type: 'MESSAGE',
                body: replyText
            });
            toast.success('Reply logged');
            setReplyText('');
            fetchLead();
        } catch {
            toast.error('Failed to send reply');
        }
    };

    const handleScheduleVisit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!visitData.property || !visitData.date) return;
        try {
            await axios.post('/api/visits', {
                leadId: lead.id,
                property: visitData.property,
                visitDate: visitData.date
            });
            toast.success('Visit scheduled successfully');
            setShowSchedule(false);
            setVisitData({ property: '', date: '' });
            fetchLead();
        } catch {
            toast.error('Failed to schedule visit');
        }
    };

    const handleUpdateVisitOutcome = async (visitId: string, outcome: string) => {
        try {
            await axios.patch(`/api/visits/${visitId}`, { outcome });
            toast.success('Visit outcome updated');
            fetchLead();
        } catch {
            toast.error('Failed to update visit outcome');
        }
    };

    if (loading || !lead) return <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div></div>;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Left Column: Lead Info */}
            <div className="lg:col-span-1 space-y-6">
                <div className="glass-panel rounded-3xl border border-white/5 relative overflow-hidden shadow-2xl group">
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-transparent"></div>
                    <div className="p-6 relative z-10 pt-12">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white mb-5 shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-white/10 ring-4 ring-[#0f172a]">
                            {lead.name.charAt(0)}
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">{lead.name}</h1>
                        <span className={`inline-block mt-3 text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-full border shadow-sm ${
                            lead.status === 'NEW' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                            lead.status === 'BOOKED' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' : 
                            lead.status === 'LOST' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                            'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        }`}>
                            {lead.status.replace(/_/g, ' ')}
                        </span>

                        <div className="mt-8 space-y-4 pt-6 border-t border-white/5">
                            <InfoRow icon={<Phone className="w-4 h-4 text-indigo-400" />} label="Phone" value={lead.phone} />
                            <InfoRow icon={<MapPin className="w-4 h-4 text-purple-400" />} label="Source" value={lead.source} />
                            <InfoRow icon={<User className="w-4 h-4 text-blue-400" />} label="Owner" value={lead.agent?.name || 'Unassigned'} />
                            <InfoRow icon={<Clock className="w-4 h-4 text-gray-400" />} label="Created" value={new Date(lead.createdAt).toLocaleString()} />
                        </div>
                    </div>
                </div>

                {/* Visits Panel */}
                <div className="glass-panel p-6 rounded-3xl border border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2"><Calendar className="w-5 h-5 text-purple-400" /> Visits</h2>
                        <button onClick={() => setShowSchedule(!showSchedule)} className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition">
                            <Plus className="w-4 h-4 text-gray-300" />
                        </button>
                    </div>

                    {showSchedule && (
                        <form onSubmit={handleScheduleVisit} className="mb-4 space-y-3 bg-[#0f172a] p-4 rounded-xl border border-gray-800">
                            <input
                                type="text" placeholder="Property Name" required
                                value={visitData.property} onChange={e => setVisitData({ ...visitData, property: e.target.value })}
                                className="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                            />
                            <input
                                type="datetime-local" required
                                value={visitData.date} onChange={e => setVisitData({ ...visitData, date: e.target.value })}
                                className="w-full bg-[#1e293b] border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                            />
                            <button type="submit" className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-medium transition">
                                Confirm Schedule
                            </button>
                        </form>
                    )}

                    <div className="space-y-3">
                        {lead.visits.length === 0 ? (
                            <p className="text-gray-500 text-sm">No visits scheduled.</p>
                        ) : (
                            lead.visits.map((v: any) => (
                                <div key={v.id} className="p-3 bg-white/5 rounded-xl border border-white/5 relative">
                                    <p className="font-medium text-gray-200 text-sm">{v.property}</p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(v.visitDate).toLocaleString()}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <select
                                            value={v.outcome}
                                            onChange={(e) => handleUpdateVisitOutcome(v.id, e.target.value)}
                                            className="bg-[#0f172a] border border-gray-700 text-xs text-purple-300 font-bold rounded px-2 py-1 outline-none focus:border-purple-500"
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="BOOKED">BOOKED</option>
                                            <option value="CONSIDERING">CONSIDERING</option>
                                            <option value="NOT_INTERESTED">NOT INTERESTED</option>
                                        </select>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Right Column: Timeline / Conversations */}
            <div className="lg:col-span-2 flex flex-col h-[calc(100vh-100px)]">
                <div className="glass-panel rounded-3xl border border-white/5 shadow-2xl flex-1 flex flex-col overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                    <div className="p-6 border-b border-white/5 bg-white/[0.02] backdrop-blur-md relative z-10">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 tracking-wide">
                            <MessageSquare className="w-5 h-5 text-indigo-400 drop-shadow-[0_0_8px_rgba(79,70,229,0.5)]" /> Conversation History
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">SLA First Response: {lead.firstRespondedAt ? <span className="text-emerald-400 font-medium">Met at {new Date(lead.firstRespondedAt).toLocaleTimeString()}</span> : <span className="text-red-400 font-medium animate-pulse">Pending... Action Required!</span>}</p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar flex flex-col-reverse relative z-10">
                        {lead.conversations.map((msg: any) => (
                            <div key={msg.id} className={`flex ${msg.type === 'SYSTEM_EVENT' ? 'justify-center' : 'justify-end animate-fade-in-up'}`}>
                                {msg.type === 'SYSTEM_EVENT' ? (
                                    <div className="bg-white/[0.03] border border-white/10 px-5 py-2 rounded-full text-xs text-gray-400 flex items-center gap-3 shadow-sm">
                                        <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_#4f46e5]" />
                                        {msg.body}
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white p-4 rounded-2xl rounded-tr-sm max-w-[80%] shadow-[0_8px_20px_rgba(79,70,229,0.2)] border border-indigo-400/20 hover:-translate-y-0.5 transition-transform">
                                        <p className="text-sm leading-relaxed tracking-wide">{msg.body}</p>
                                        <p className="text-[10px] text-indigo-200 mt-2 text-right uppercase tracking-wider font-semibold opacity-80">{new Date(msg.createdAt).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-white/[0.02] backdrop-blur-xl border-t border-white/5 relative z-10">
                        <form onSubmit={handleReply} className="flex gap-3 relative group">
                            <div className="absolute inset-0 bg-indigo-500/10 rounded-xl blur-md transition-all opacity-0 group-focus-within:opacity-100"></div>
                            <input
                                type="text"
                                value={replyText}
                                onChange={e => setReplyText(e.target.value)}
                                placeholder="Type a WhatsApp reply or note..."
                                className="relative flex-1 bg-[#0f172a]/80 backdrop-blur-md border border-white/10 rounded-xl px-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-inner"
                            />
                            <button type="submit" className="relative px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center gap-2">
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InfoRow({ icon, label, value }: { icon: any, label: string, value: string }) {
    return (
        <div className="flex items-center gap-4 hover:bg-white/[0.02] p-2 -mx-2 rounded-xl transition-colors">
            <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-center shadow-inner">
                {icon}
            </div>
            <div>
                <p className="text-[11px] uppercase tracking-wider font-semibold text-gray-500">{label}</p>
                <p className="text-sm font-medium text-gray-200 tracking-wide mt-0.5">{value}</p>
            </div>
        </div>
    );
}
