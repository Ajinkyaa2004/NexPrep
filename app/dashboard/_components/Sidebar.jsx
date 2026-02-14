"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Video, FileText, BarChart2, ShieldCheck, Settings, LogOut, PlusCircle, PenBox } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { auth } from "../../../firebase/client";


const menuList = [
    {
        id: 1,
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/dashboard",
    },

    {
        id: 3,
        name: "Questions",
        icon: FileText,
        path: "/dashboard/questions",
    },
    {
        id: 4,
        name: "Resume Builder",
        icon: PenBox,
        path: "/dashboard/resume",
    },

    {
        id: 6,
        name: "ATS Checker",
        icon: ShieldCheck,
        path: "/dashboard/ats-checker",
    },
];

export default function Sidebar() {
    const path = usePathname();
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((u) => {
            setUser(u);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="h-[96vh] w-72 bg-white/80 backdrop-blur-2xl border-r border-gray-200/50 flex flex-col p-6 fixed left-0 top-0 z-50 shadow-sm">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10 px-2 mt-2">
                <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20">
                    <Image src="/logo.svg" width={32} height={32} alt="Logo" className="w-7 h-7 text-primary" />
                </div>
                <span className="font-bold text-2xl text-gray-900 tracking-tight">NexPrep</span>
            </div>

            {/* Main Menu */}
            <div className="flex-1 flex flex-col gap-2">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 px-4">Menu</p>
                {menuList.map((menu) => (
                    <Link href={menu.path} key={menu.id}>
                        <div className={`
                    flex items-center gap-4 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 group relative overflow-hidden
                    ${path === menu.path
                                ? 'bg-primary/5 text-primary font-semibold'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-primary'}
                `}>
                            {/* Neon Indicator for Active Link */}
                            {path === menu.path && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full shadow-[0_0_10px_#4A6CFF]"></div>}

                            <menu.icon className={`w-5 h-5 ${path === menu.path ? 'text-primary' : 'text-gray-400 group-hover:text-primary transition-colors'}`} />
                            <span className="z-10">{menu.name}</span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* User & Logout */}
            <div className="mt-8 border-t border-gray-100 pt-6">
                <div className="flex items-center gap-3 mb-6 px-3 p-2 rounded-xl border border-transparent hover:border-gray-100 hover:bg-white transition-all cursor-pointer">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 p-[2px]">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                            <span className="font-bold text-primary text-xs">U</span>
                        </div>
                    </div>
                    <div>
                        <div>
                            <h4 className="font-bold text-sm text-gray-800">{user?.displayName || "User"}</h4>
                            <p className="text-[10px] text-gray-400 font-medium truncate max-w-[150px]" title={user?.email}>{user?.email || "PREMIUM PLAN"}</p>
                        </div>
                    </div>
                </div>

                <Button variant="ghost" className="w-full justify-start gap-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg py-5 text-sm">
                    <LogOut className="w-4 h-4 ml-1" />
                    Sign Out
                </Button>
            </div>
        </div>
    );
}
