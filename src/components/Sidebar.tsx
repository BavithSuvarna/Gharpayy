"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, User, Settings, BellRing } from 'lucide-react';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Pipeline', href: '/pipeline', icon: User },
    { name: 'Leads Directory', href: '/leads', icon: Users },
    { name: 'Mock Form', href: '/mock-form', icon: BellRing },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 glass-sidebar h-screen hidden md:flex flex-col">
            <div className="h-16 flex items-center px-6 border-b border-[var(--border)]">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/30">
                        G
                    </div>
                    <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Gharpayy</span>
                </div>
            </div>

            <div className="flex-1 py-6 px-4 space-y-2">
                <p className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Operations</p>
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group overflow-hidden ${isActive
                                ? 'bg-indigo-500/10 text-indigo-400 shadow-[inset_0_0_20px_rgba(79,70,229,0.1)]'
                                : 'text-gray-400 hover:text-gray-100 hover:bg-white/[0.04]'
                                }`}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full shadow-[0_0_10px_#4f46e5]" />
                            )}
                            <item.icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-[0_0_8px_rgba(79,70,229,0.6)]' : 'group-hover:scale-110'}`} />
                            <span className="font-medium text-sm tracking-wide">{item.name}</span>
                        </Link>
                    );
                })}
            </div>

            <div className="p-4 border-t border-[var(--border)]">
                <div className="flex items-center gap-3 px-3 py-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-medium text-white shadow-md">
                        AM
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-200">Admin Mode</span>
                        <span className="text-xs text-green-400">All Systems Operational</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
