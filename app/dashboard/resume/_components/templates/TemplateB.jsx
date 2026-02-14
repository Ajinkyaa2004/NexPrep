
import React from 'react';

const TemplateB = ({ data, themeColor = "#7f1d1d" }) => { // Deep Red / Maroon
    return (
        <div className="w-full h-full bg-white shadow-lg min-h-[800px] text-sm flex flex-col">

            {/* Header */}
            <div className="flex">
                <div className="w-1/3 bg-white border-2 border-gray-100 flex items-center justify-center p-6 relative">
                    <div className="w-full h-48 border-4 flex items-center justify-center" style={{ borderColor: themeColor }}>
                        {data?.profileImage ? (
                            <img src={data.profileImage} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-4xl font-bold text-gray-300">{data?.firstName?.[0]}{data?.lastName?.[0]}</span>
                        )}
                    </div>
                </div>
                <div className="w-2/3 text-white p-10 flex flex-col justify-center" style={{ backgroundColor: themeColor }}>
                    <h1 className="text-5xl font-bold">{data?.firstName} <br /> {data?.lastName}</h1>
                    <p className="mt-4 text-white/80 uppercase tracking-widest">{data?.jobTitle}</p>
                </div>
            </div>

            {/* Body */}
            <div className="flex flex-1">
                {/* Left Column (Contact/Skills) */}
                <div className="w-1/3 bg-gray-100 p-8 space-y-8">

                    <div>
                        <h3 className="font-bold text-lg mb-3 uppercase tracking-wider text-gray-800">Contact</h3>
                        <div className="space-y-2 text-xs text-gray-600">
                            <p className="font-semibold">{data?.phone}</p>
                            <p>{data?.email}</p>
                            <p className="whitespace-pre-line">{data?.address}</p>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-3 uppercase tracking-wider text-gray-800">Education</h3>
                        <div className="space-y-4">
                            {data?.education?.map(edu => (
                                <div key={edu.id}>
                                    <p className="font-bold text-xs">{edu.degree}</p>
                                    <p className="text-xs text-gray-500">{edu.university}</p>
                                    <p className="text-xs text-gray-400 italic">{edu.startDate} - {edu.endDate}</p>
                                    <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">{edu.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-bold text-lg mb-3 uppercase tracking-wider text-gray-800">Skills</h3>
                        <div className="space-y-1">
                            {data?.skills?.map((skill, index) => (
                                <p key={index} className="text-xs text-gray-600 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-gray-800 rounded-full"></span> {skill}
                                </p>
                            ))}
                        </div>
                    </div>

                    {data?.certifications?.length > 0 && (
                        <div>
                            <h3 className="font-bold text-lg mb-3 uppercase tracking-wider text-gray-800">Certifications</h3>
                            <div className="space-y-2">
                                {data.certifications.map((cert) => (
                                    <div key={cert.id}>
                                        <p className="font-bold text-xs">{cert.name}</p>
                                        <p className="text-xs text-gray-500">{cert.issuer}, {cert.date}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>

                {/* Right Column (Exp/Summary/Projects) */}
                <div className="w-2/3 p-10 relative">

                    {/* Decorative Overlay for Titles */}
                    <div className="absolute top-8 left-0 w-24 h-10 -ml-4" style={{ backgroundColor: '#d97706' }}></div> {/* Gold/Orange accent */}

                    <div className="relative z-10 space-y-8">

                        <div>
                            <h3 className="text-xl font-bold uppercase text-white mb-4 px-2 py-1 inline-block" style={{ backgroundColor: '#d97706' }}>Professional Experience</h3>
                            <div className="space-y-6 mt-4">
                                {data?.experience?.map(exp => (
                                    <div key={exp.id}>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <h4 className="font-bold text-sm text-gray-800">{exp.title} | {exp.company}</h4>
                                        </div>
                                        <div className="text-xs text-gray-600 whitespace-pre-line pl-2 border-l-2 border-gray-200">
                                            {exp.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {data?.projects?.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold uppercase text-white mb-4 px-2 py-1 inline-block" style={{ backgroundColor: '#d97706' }}>Projects</h3>
                                <div className="space-y-4 mt-2">
                                    {data.projects.map((proj) => (
                                        <div key={proj.id}>
                                            <h4 className="font-bold text-gray-800 text-sm">{proj.title}</h4>
                                            <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">{proj.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className="text-xl font-bold uppercase text-white mb-4 px-2 py-1 inline-block" style={{ backgroundColor: '#d97706' }}>Profile</h3>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                {data?.summary}
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {/* Footer or Extra Left Column Content (Certifications) - Placing in Left Column via conditional check if space permits, or better, append to left column div */}
        </div>
    )
}


export default TemplateB;
