import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import LayoutWrapper from '@/components/LayoutWrapper'
import { Toaster } from 'react-hot-toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Gharpayy CRM',
    description: 'Lead Management System MVP',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
            <body className={inter.className}>
                <LayoutWrapper>
                    {children}
                </LayoutWrapper>
                <Toaster
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            background: '#1e293b',
                            color: '#fff',
                            border: '1px solid #334155'
                        }
                    }}
                />
            </body>
        </html>
    )
}
