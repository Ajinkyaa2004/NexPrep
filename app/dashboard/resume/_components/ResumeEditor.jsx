
"use client";
import React, { useState, useEffect } from "react";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { dummyResumeData } from "./dummyData";
import { ArrowLeft, Save, Download, Eye, Upload, Plus, Trash2 } from "lucide-react";

import TemplateA from "./templates/TemplateA";
import TemplateB from "./templates/TemplateB";
import TemplateC from "./templates/TemplateC";
import TemplateD from "./templates/TemplateD";

const ResumeEditor = ({ selectedTemplate, onBack }) => {
    const [formData, setFormData] = useState(dummyResumeData);
    const [previewMode, setPreviewMode] = useState(false); // Mobile toggle

    // --- Handlers ---
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profileImage: reader.result }));
            }
            reader.readAsDataURL(file);
        }
    }

    // --- Experience ---
    const handleExpChange = (index, field, value) => {
        const newExp = [...formData.experience];
        newExp[index][field] = value;
        setFormData((prev) => ({ ...prev, experience: newExp }));
    };

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [
                ...prev.experience,
                { id: Date.now(), title: "", company: "", city: "", state: "", startDate: "", endDate: "", description: "" }
            ]
        }));
    };

    const removeExperience = (index) => {
        const newExp = [...formData.experience];
        newExp.splice(index, 1);
        setFormData(prev => ({ ...prev, experience: newExp }));
    };

    // --- Education ---
    const handleEduChange = (index, field, value) => {
        const newEdu = [...formData.education];
        newEdu[index][field] = value;
        setFormData((prev) => ({ ...prev, education: newEdu }));
    };

    const addEducation = () => {
        setFormData(prev => ({
            ...prev,
            education: [
                ...prev.education,
                { id: Date.now(), university: "", degree: "", startDate: "", endDate: "", description: "" }
            ]
        }));
    };

    const removeEducation = (index) => {
        const newEdu = [...formData.education];
        newEdu.splice(index, 1);
        setFormData(prev => ({ ...prev, education: newEdu }));
    };

    // --- Skills ---
    const handleSkillChange = (index, value) => {
        const newSkills = [...formData.skills];
        newSkills[index] = value;
        setFormData(prev => ({ ...prev, skills: newSkills }));
    };

    const addSkill = () => {
        setFormData(prev => ({
            ...prev,
            skills: [...prev.skills, ""]
        }));
    };

    const removeSkill = (index) => {
        const newSkills = [...formData.skills];
        newSkills.splice(index, 1);
        setFormData(prev => ({ ...prev, skills: newSkills }));
    };

    // --- Projects ---
    const handleProjectChange = (index, field, value) => {
        const newProjects = [...(formData.projects || [])];
        if (!newProjects[index]) newProjects[index] = {};
        newProjects[index][field] = value;
        setFormData(prev => ({ ...prev, projects: newProjects }));
    };

    const addProject = () => {
        setFormData(prev => ({
            ...prev,
            projects: [
                ...(prev.projects || []),
                { id: Date.now(), title: "", description: "" }
            ]
        }));
    };

    const removeProject = (index) => {
        const newProjects = [...(formData.projects || [])];
        newProjects.splice(index, 1);
        setFormData(prev => ({ ...prev, projects: newProjects }));
    };

    // --- Certifications ---
    const handleCertChange = (index, field, value) => {
        const newCerts = [...(formData.certifications || [])];
        if (!newCerts[index]) newCerts[index] = {};
        newCerts[index][field] = value;
        setFormData(prev => ({ ...prev, certifications: newCerts }));
    };

    const addCertification = () => {
        setFormData(prev => ({
            ...prev,
            certifications: [
                ...(prev.certifications || []),
                { id: Date.now(), name: "", date: "", issuer: "" }
            ]
        }));
    };

    const removeCertification = (index) => {
        const newCerts = [...(formData.certifications || [])];
        newCerts.splice(index, 1);
        setFormData(prev => ({ ...prev, certifications: newCerts }));
    };


    // --- Template Renderer ---
    const renderTemplate = () => {
        switch (selectedTemplate) {
            case "modern":
                return <TemplateA data={formData} />; // Cyan
            case "professional":
                return <TemplateB data={formData} />; // Maroon
            case "creative":
                return <TemplateC data={formData} />; // Blue
            case "minimalist":
                return <TemplateD data={formData} />; // Minimalist
            default:
                return <TemplateA data={formData} />;
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-50">

            {/* Toolbar */}
            <div className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm z-10 sticky top-0">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={onBack}><ArrowLeft className="w-4 h-4 mr-2" /> Back</Button>
                    <h2 className="font-bold text-xl text-gray-800">Resume Editor</h2>
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full uppercase font-medium">{selectedTemplate}</span>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" className="md:hidden" onClick={() => setPreviewMode(!previewMode)}>
                        <Eye className="w-4 h-4 mr-2" /> {previewMode ? "Edit" : "Preview"}
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white gap-2" onClick={() => window.print()}>
                        <Download className="w-4 h-4" /> Download PDF
                    </Button>
                </div>
            </div>

            {/* Main Grid */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 overflow-hidden">

                {/* Form Section (Scrollable) */}
                <div className={`p-8 overflow-y-auto ${previewMode ? 'hidden md:block' : 'block'}`}>
                    <div className="max-w-xl mx-auto space-y-8 pb-20">

                        {/* Personal Info */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <h3 className="font-bold text-lg border-b pb-2 mb-4">Personal Information</h3>

                            {/* Image Upload - Hidden for Creative & Minimalist */}
                            {!['creative', 'minimalist'].includes(selectedTemplate) && (
                                <div className="flex items-center gap-4 mb-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden border-2 border-white shadow-sm">
                                        {formData.profileImage ? <img src={formData.profileImage} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">?</div>}
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-semibold text-gray-600 mb-1 block">Profile Photo (Optional)</label>
                                        <Input type="file" onChange={handleImageUpload} accept="image/*" className="text-xs file:bg-blue-500 file:text-white file:border-0 file:rounded-full file:px-3 file:py-1" />
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">First Name</label>
                                    <Input name="firstName" value={formData.firstName} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Last Name</label>
                                    <Input name="lastName" value={formData.lastName} onChange={handleChange} />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Job Title</label>
                                <Input name="jobTitle" value={formData.jobTitle} onChange={handleChange} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Phone</label>
                                    <Input name="phone" value={formData.phone} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700">Email</label>
                                    <Input name="email" value={formData.email} onChange={handleChange} />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Address</label>
                                <Textarea name="address" value={formData.address} onChange={handleChange} className="h-16 resize-none" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-700">Professional Summary</label>
                                <Textarea name="summary" value={formData.summary} onChange={handleChange} className="h-24" />
                            </div>
                        </div>

                        {/* Experience */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <div className="flex justify-between items-center border-b pb-2 mb-4">
                                <h3 className="font-bold text-lg">Experience</h3>
                                <Button size="sm" variant="outline" onClick={addExperience} className="text-green-600 border-green-200 hover:bg-green-50"><Plus className="w-4 h-4 mr-1" /> Add</Button>
                            </div>

                            {formData.experience.map((exp, index) => (
                                <div key={exp.id} className="p-4 border rounded-lg bg-gray-50/50 space-y-3 relative group">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeExperience(index)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500">Title</label>
                                            <Input value={exp.title} onChange={(e) => handleExpChange(index, 'title', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500">Company</label>
                                            <Input value={exp.company} onChange={(e) => handleExpChange(index, 'company', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500">Start Date</label>
                                            <Input value={exp.startDate} onChange={(e) => handleExpChange(index, 'startDate', e.target.value)} placeholder="Ex: Jan 2020" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500">End Date</label>
                                            <Input value={exp.endDate} onChange={(e) => handleExpChange(index, 'endDate', e.target.value)} placeholder="Ex: Present" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500">Description</label>
                                        <Textarea value={exp.description} onChange={(e) => handleExpChange(index, 'description', e.target.value)} className="h-20" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Education */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <div className="flex justify-between items-center border-b pb-2 mb-4">
                                <h3 className="font-bold text-lg">Education</h3>
                                <Button size="sm" variant="outline" onClick={addEducation} className="text-blue-600 border-blue-200 hover:bg-blue-50"><Plus className="w-4 h-4 mr-1" /> Add</Button>
                            </div>

                            {formData.education.map((edu, index) => (
                                <div key={edu.id} className="p-4 border rounded-lg bg-gray-50/50 space-y-3 relative group">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeEducation(index)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500">University/School</label>
                                            <Input value={edu.university} onChange={(e) => handleEduChange(index, 'university', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500">Degree</label>
                                            <Input value={edu.degree} onChange={(e) => handleEduChange(index, 'degree', e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500">Start Date</label>
                                            <Input value={edu.startDate} onChange={(e) => handleEduChange(index, 'startDate', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500">End Date</label>
                                            <Input value={edu.endDate} onChange={(e) => handleEduChange(index, 'endDate', e.target.value)} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500">Description (Optional)</label>
                                        <Textarea value={edu.description || ""} onChange={(e) => handleEduChange(index, 'description', e.target.value)} className="h-20" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Skills */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <div className="flex justify-between items-center border-b pb-2 mb-4">
                                <h3 className="font-bold text-lg">Skills</h3>
                                <Button size="sm" variant="outline" onClick={addSkill} className="text-purple-600 border-purple-200 hover:bg-purple-50"><Plus className="w-4 h-4 mr-1" /> Add</Button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {formData.skills.map((skill, index) => (
                                    <div key={index} className="flex items-center gap-2 group relative">
                                        <Input
                                            value={skill}
                                            onChange={(e) => handleSkillChange(index, e.target.value)}
                                            placeholder={`Skill ${index + 1}`}
                                            className="pr-8"
                                        />
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeSkill(index)}
                                            className="text-gray-400 hover:text-red-500 h-8 w-8"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Projects */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <div className="flex justify-between items-center border-b pb-2 mb-4">
                                <h3 className="font-bold text-lg">Projects</h3>
                                <Button size="sm" variant="outline" onClick={addProject} className="text-orange-600 border-orange-200 hover:bg-orange-50"><Plus className="w-4 h-4 mr-1" /> Add</Button>
                            </div>

                            {(formData.projects || []).map((proj, index) => (
                                <div key={proj.id} className="p-4 border rounded-lg bg-gray-50/50 space-y-3 relative group">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeProject(index)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>

                                    <div>
                                        <label className="text-xs font-semibold text-gray-500">Project Title</label>
                                        <Input value={proj.title} onChange={(e) => handleProjectChange(index, 'title', e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-semibold text-gray-500">Description</label>
                                        <Textarea value={proj.description} onChange={(e) => handleProjectChange(index, 'description', e.target.value)} className="h-20" />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Certifications */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <div className="flex justify-between items-center border-b pb-2 mb-4">
                                <h3 className="font-bold text-lg">Certifications</h3>
                                <Button size="sm" variant="outline" onClick={addCertification} className="text-teal-600 border-teal-200 hover:bg-teal-50"><Plus className="w-4 h-4 mr-1" /> Add</Button>
                            </div>

                            {(formData.certifications || []).map((cert, index) => (
                                <div key={cert.id} className="p-4 border rounded-lg bg-gray-50/50 space-y-3 relative group">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeCertification(index)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>

                                    <div>
                                        <label className="text-xs font-semibold text-gray-500">Certification Name</label>
                                        <Input value={cert.name} onChange={(e) => handleCertChange(index, 'name', e.target.value)} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500">Issuer</label>
                                            <Input value={cert.issuer} onChange={(e) => handleCertChange(index, 'issuer', e.target.value)} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-semibold text-gray-500">Date</label>
                                            <Input value={cert.date} onChange={(e) => handleCertChange(index, 'date', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>

                {/* Preview Section (Sticky/Scrollable) */}
                <div className={`bg-gray-200 p-8 overflow-y-auto flex justify-center ${!previewMode ? 'hidden md:flex' : 'flex'}`}>
                    <div className="bg-white shadow-2xl w-full max-w-[210mm] min-h-[297mm] origin-top transform scale-90 md:scale-100 transition-transform duration-200">
                        {renderTemplate()}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ResumeEditor;
