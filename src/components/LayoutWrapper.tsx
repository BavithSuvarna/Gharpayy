"use client";

import Sidebar from './Sidebar';
import { ReactNode } from 'react';

export default function LayoutWrapper({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
                {children}
            </main>
        </div>
    );
}
