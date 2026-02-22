import { ReactNode } from "react";
import Link from "next/link";
import { Shield, LayoutDashboard, Users, Activity, Settings } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
            {/* Sidebar Navigation */}
            <aside className="w-64 border-r border-zinc-800 bg-zinc-950/50 flex flex-col">
                <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-red-500/20 flex items-center justify-center">
                        <Shield className="w-4 h-4 text-red-500" />
                    </div>
                    <span className="font-bold tracking-tight text-white">Super Admin</span>
                </div>

                <nav className="flex-1 p-4 space-y-2 text-sm font-medium">
                    <Link href="/admin-portal" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-zinc-900 text-white">
                        <LayoutDashboard className="w-4 h-4 text-zinc-400" /> Dashboard
                    </Link>
                    <Link href="/admin-portal/users" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-900/50 text-zinc-400 hover:text-white transition-colors">
                        <Users className="w-4 h-4" /> Users
                    </Link>
                    <Link href="/admin-portal/generations" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-900/50 text-zinc-400 hover:text-white transition-colors">
                        <Activity className="w-4 h-4" /> Generations
                    </Link>
                    <Link href="/admin-portal/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-zinc-900/50 text-zinc-400 hover:text-white transition-colors">
                        <Settings className="w-4 h-4" /> AI Settings
                    </Link>
                </nav>

                <div className="p-4 border-t border-zinc-800 text-xs text-zinc-500">
                    ImmersaAI Engine v1.0
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-black">
                <header className="h-16 border-b border-zinc-800 flex items-center px-8 bg-zinc-950/50 backdrop-blur-sm sticky top-0 z-10">
                    <h1 className="font-semibold text-lg text-white">Owner Overview</h1>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
