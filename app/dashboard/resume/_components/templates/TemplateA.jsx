
import React from 'react';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

const TemplateA = ({ data, themeColor = "#0e7490" }) => { // Default Cyan
    return (
        <div className="w-full h-full bg-white shadow-lg grid grid-cols-12 min-h-[800px] text-sm">
            {/* Sidebar */}
            <div className="col-span-4 text-white p-6 flex flex-col gap-6" style={{ backgroundColor: themeColor }}>

                {/* Photo Area */}
                {data?.profileImage && (
                    <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white/30 mb-2">
                        <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                )}

                {/* Contact Info */}
                <div className="space-y-4">
                    <h3 className="font-bold border-b border-white/30 pb-2 mb-3 tracking-widest text-xs">CONTACT</h3>
                    <div className="flex items-center gap-2 text-xs">
                        <Mail className="w-3 h-3" /> <span>{data?.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <Phone className="w-3 h-3" /> <span>{data?.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                        <MapPin className="w-3 h-3" /> <span className="whitespace-pre-line">{data?.address}</span>
                    </div>
                </div>

                {/* Skills */}
                <div className="mt-4">
                    <h3 className="font-bold border-b border-white/30 pb-2 mb-3 tracking-widest text-xs">SKILLS</h3>
                    <ul className="space-y-2">
                        {data?.skills?.map((skill, index) => (
                            <li key={index} className="flex items-center gap-2 text-xs">
                                <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                                {skill}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="col-span-8 p-8 text-gray-800">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold uppercase tracking-wide text-gray-900" style={{ color: themeColor }}>{data?.firstName} <br /> <span className="text-gray-700">{data?.lastName}</span></h1>
                    <p className="text-lg tracking-widest mt-2 uppercase text-gray-500 font-medium">{data?.jobTitle}</p>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed mb-8 whitespace-pre-line">
                    {data?.summary}
                </p>

                {/* Experience */}
                <div className="mb-8">
                    <h3 className="font-bold text-lg uppercase mb-4 border-b-2 pb-1" style={{ borderColor: themeColor, color: themeColor }}>Professional Experience</h3>
                    <div className="space-y-5">
                        {data?.experience?.map((exp) => (
                            <div key={exp.id}>
                                <h4 className="font-bold text-gray-800">{exp.title}</h4>
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span className='font-semibold italic'>{exp.company}</span>
                                    <span>{exp.startDate} - {exp.endDate}</span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Education */}
                <div>
                    <h3 className="font-bold text-lg uppercase mb-4 border-b-2 pb-1" style={{ borderColor: themeColor, color: themeColor }}>Education</h3>
                    <div className="space-y-4">
                        {data?.education?.map((edu) => (
                            <div key={edu.id}>
                                <h4 className="font-bold text-gray-800">{edu.degree}</h4>
                                <div className="text-xs text-gray-500">
                                    {edu.university}, {edu.startDate} - {edu.endDate}
                                </div>
                                <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">{edu.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TemplateA;
