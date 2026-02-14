import React from 'react';
import { BookOpen, FileSpreadsheet, HelpCircle } from 'lucide-react';
import Link from 'next/link';

function DashboardMenus() {
    const menus = [
        {
            title: "Practice Questions",
            desc: "Browse common interview questions",
            icon: <BookOpen className="h-8 w-8 text-blue-500" />,
            path: "/dashboard/questions"
        },
        {
            title: "Resume Builder",
            desc: "Create a professional resume",
            icon: <FileSpreadsheet className="h-8 w-8 text-green-500" />,
            path: "/dashboard/resume" // Functional placeholder
        },
        {
            title: "How it Works",
            desc: "Learn about our modules",
            icon: <HelpCircle className="h-8 w-8 text-orange-500" />,
            path: "/dashboard/how-it-works"
        },
        {
            title: "ATS Resume Checker",
            desc: "Score your resume against JDs",
            icon: <BookOpen className="h-8 w-8 text-purple-600" />,
            path: "/dashboard/ats-checker"
        }
    ];

    return (
        <div className='mt-8'>
            <h2 className='font-bold text-xl mb-4'>Quick Access</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5'>
                {menus.map((item, index) => (
                    <Link href={item.path} key={index}>
                        <div className='p-6 border rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer bg-white group hover:border-blue-300'>
                            <div className='mb-3 p-2 bg-gray-50 rounded-full w-fit group-hover:bg-blue-50 transition-colors'>
                                {item.icon}
                            </div>
                            <h3 className='font-bold text-lg text-gray-800 group-hover:text-blue-600 transition-colors'>{item.title}</h3>
                            <p className='text-sm text-gray-500 mt-1'>{item.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default DashboardMenus;
