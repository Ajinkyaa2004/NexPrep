
import React from 'react';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

const TemplateD = ({ data, themeColor = "#000000" }) => { // Standard Black/Gray
    return (
        <div className="w-full h-full bg-white shadow-lg min-h-[800px] text-sm p-10 font-serif text-gray-800">

            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold uppercase tracking-wide text-gray-900 mb-2">{data?.firstName} {data?.lastName}</h1>

                <div className="flex justify-center items-center gap-3 text-xs text-gray-600 flex-wrap">
                    {data?.address && (
                        <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> <span className="whitespace-pre-line">{data.address}</span>
                        </div>
                    )}
                    {data?.address && (data?.email || data?.phone) && <span>|</span>}

                    {data?.email && (
                        <div className="flex items-center gap-1">
                            <Mail className="w-3 h-3" /> <span>{data.email}</span>
                        </div>
                    )}
                    {data?.email && data?.phone && <span>|</span>}

                    {data?.phone && (
                        <div className="flex items-center gap-1">
                            <Phone className="w-3 h-3" /> <span>{data.phone}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Section: Summary */}
            <div className="mb-6">
                <h3 className="font-bold text-sm uppercase tracking-wider border-b border-gray-300 pb-1 mb-3 text-gray-900">Professional Summary</h3>
                <p className="text-xs leading-relaxed text-gray-700 whitespace-pre-line">{data?.summary}</p>
            </div>

            {/* Section: Experience */}
            <div className="mb-6">
                <h3 className="font-bold text-sm uppercase tracking-wider border-b border-gray-300 pb-1 mb-4 text-gray-900">Professional Experience</h3>
                <div className="space-y-5">
                    {data?.experience?.map((exp) => (
                        <div key={exp.id}>
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="font-bold text-sm text-gray-900">{exp.title}</h4>
                                <span className="text-xs font-semibold text-gray-600">{exp.startDate} – {exp.endDate}</span>
                            </div>
                            <div className="text-xs font-bold text-gray-700 mb-2">{exp.company}</div>

                            <p className="text-xs text-gray-600 leading-relaxed pl-1 whitespace-pre-line">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section: Education */}
            <div className="mb-6">
                <h3 className="font-bold text-sm uppercase tracking-wider border-b border-gray-300 pb-1 mb-4 text-gray-900">Education</h3>
                <div className="space-y-3">
                    {data?.education?.map((edu) => (
                        <div key={edu.id}>
                            <h4 className="font-bold text-sm text-gray-900">{edu.degree}</h4>
                            <div className="flex justify-between text-xs text-gray-600">
                                <span>{edu.university}</span>
                                <span>{edu.startDate} – {edu.endDate}</span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed mt-1 whitespace-pre-line">{edu.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Section: Projects */}
            {data?.projects?.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-bold text-sm uppercase tracking-wider border-b border-gray-300 pb-1 mb-4 text-gray-900">Projects</h3>
                    <div className="space-y-4">
                        {data.projects.map((proj) => (
                            <div key={proj.id}>
                                <h4 className="font-bold text-sm text-gray-900">{proj.title}</h4>
                                <p className="text-xs text-gray-600 leading-relaxed mt-1 whitespace-pre-line">{proj.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Section: Certifications */}
            {data?.certifications?.length > 0 && (
                <div className="mb-6">
                    <h3 className="font-bold text-sm uppercase tracking-wider border-b border-gray-300 pb-1 mb-3 text-gray-900">Certifications</h3>
                    <div className="space-y-2">
                        {data.certifications.map((cert) => (
                            <div key={cert.id}>
                                <h4 className="font-bold text-sm text-gray-900">{cert.name}</h4>
                                <p className="text-xs text-gray-600">{cert.issuer} – {cert.date}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Section: Skills */}
            <div>
                <h3 className="font-bold text-sm uppercase tracking-wider border-b border-gray-300 pb-1 mb-3 text-gray-900">Skills</h3>
                <div className="text-xs text-gray-700 leading-relaxed">
                    <span className="font-bold text-gray-900 mr-2">Key Skills:</span>
                    {data?.skills?.join(", ")}
                </div>
            </div>

        </div>
    )
}

export default TemplateD;
