
import React from 'react';

const TemplateC = ({ data, themeColor = "#2563eb" }) => { // Royal Blue
    return (
        <div className="w-full h-full bg-white shadow-lg min-h-[800px] text-sm p-10 font-sans">

            {/* Header Center */}
            <div className="text-center border-b-2 pb-6 mb-6" style={{ borderColor: themeColor }}>
                {/* Added Image Support */}
                {data?.profileImage && (
                    <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-gray-100 mb-4 shadow-sm">
                        <img src={data.profileImage} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                )}

                <h1 className="text-4xl font-bold uppercase tracking-wider" style={{ color: themeColor }}>{data?.firstName} {data?.lastName}</h1>
                <p className="font-semibold text-gray-500 mt-2 whitespace-pre-line">{data?.address} | {data?.phone} | {data?.email}</p>
            </div>

            {/* Profile Summary */}
            <div className="mb-6">
                <h3 className="font-bold text-lg uppercase mb-2" style={{ color: themeColor }}>Professional Summary</h3>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{data?.summary}</p>
            </div>

            {/* Work History */}
            <div className="mb-6">
                <h3 className="font-bold text-lg uppercase mb-4" style={{ color: themeColor }}>Work History</h3>
                <div className="space-y-5">
                    {data?.experience?.map(exp => (
                        <div key={exp.id}>
                            <div className='flex justify-between font-bold text-gray-800 text-sm'>
                                <span>{exp.title}</span>
                                <span>{exp.startDate} - {exp.endDate}</span>
                            </div>
                            <div className="text-xs font-semibold italic text-gray-500 mb-2">{exp.company}</div>
                            <div className="text-xs text-gray-600 whitespace-pre-line pl-2 border-l-2 border-gray-100">
                                {exp.description}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Education */}
            <div className="mb-6">
                <h3 className="font-bold text-lg uppercase mb-4" style={{ color: themeColor }}>Education</h3>
                {data?.education?.map(edu => (
                    <div key={edu.id} className="mb-2">
                        <p className="font-bold text-sm text-gray-800">{edu.degree}</p>
                        <p className="text-xs text-gray-600">{edu.university}</p>
                        <p className="text-xs text-gray-600 whitespace-pre-line mt-1">{edu.description}</p>
                    </div>
                ))}
            </div>

            {/* Projects */}
            {data?.projects?.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-bold text-lg uppercase mb-4" style={{ color: themeColor }}>Projects</h3>
                    <div className="space-y-4">
                        {data.projects.map((proj) => (
                            <div key={proj.id}>
                                <h4 className="font-bold text-sm text-gray-800">{proj.title}</h4>
                                <p className="text-xs text-gray-600 mt-1 whitespace-pre-line">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Certifications */}
            {data?.certifications?.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-bold text-lg uppercase mb-3" style={{ color: themeColor }}>Certifications</h3>
                    <div className="space-y-2">
                        {data.certifications.map((cert) => (
                            <div key={cert.id}>
                                <p className="font-bold text-sm text-gray-800">{cert.name}</p>
                                <p className="text-xs text-gray-600">{cert.issuer} | {cert.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            <div>
                <h3 className="font-bold text-lg uppercase mb-3" style={{ color: themeColor }}>Skills</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                    {data?.skills?.map((skill, idx) => (
                        <span key={idx} className="text-xs font-medium text-gray-700 list-item list-inside">{skill}</span>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default TemplateC;
