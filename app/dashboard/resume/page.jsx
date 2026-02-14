"use client";
import React, { useState } from 'react';
import { FileSpreadsheet, LayoutTemplate, Check, ArrowRight, LoaderCircle } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { toast } from 'sonner';
import ResumeEditor from './_components/ResumeEditor';

const ResumeBuilder = () => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [step, setStep] = useState('selection'); // 'selection' | 'editor'
    const [loading, setLoading] = useState(false);

    const templates = [
        {
            id: 'modern',
            name: 'Modern Clean',
            description: 'Minimalist design with blue accents. Best for tech roles.',
            color: 'bg-blue-50 border-blue-200 hover:border-blue-500',
            iconColor: 'text-blue-500',
            preview: (
                <div className="w-full h-32 bg-white rounded border border-gray-100 p-2 flex flex-col gap-2 relative overflow-hidden shadow-sm">
                    <div className="w-1/3 h-2 bg-blue-500 rounded"></div>
                    <div className="w-full h-1 bg-gray-100 rounded"></div>
                    <div className="flex gap-1">
                        <div className="w-1/4 h-20 bg-gray-50 rounded"></div>
                        <div className="flex-1 flex flex-col gap-1">
                            <div className="w-full h-1 bg-gray-100 rounded"></div>
                            <div className="w-3/4 h-1 bg-gray-100 rounded"></div>
                            <div className="w-full h-1 bg-gray-100 rounded"></div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'professional',
            name: 'Professional',
            description: 'Traditional layout. Perfect for corporate and management.',
            color: 'bg-gray-50 border-gray-200 hover:border-gray-800',
            iconColor: 'text-gray-800',
            preview: (
                <div className="w-full h-32 bg-white rounded border border-gray-100 p-2 flex flex-col gap-1 text-center relative overflow-hidden shadow-sm">
                    <div className="w-1/2 h-2 bg-gray-800 rounded mx-auto mb-1"></div>
                    <div className="w-full h-px bg-gray-200 mb-1"></div>
                    <div className="text-left flex flex-col gap-1">
                        <div className="w-full h-1 bg-gray-100 rounded"></div>
                        <div className="w-full h-1 bg-gray-100 rounded"></div>
                        <div className="w-5/6 h-1 bg-gray-100 rounded"></div>
                    </div>
                </div>
            )
        },
        {
            id: 'creative',
            name: 'Creative',
            description: 'Bold headers and unique structure. Stand out from the crowd.',
            color: 'bg-purple-50 border-purple-200 hover:border-purple-500',
            iconColor: 'text-purple-500',
            preview: (
                <div className="w-full h-32 bg-white rounded border border-gray-100 flex relative overflow-hidden shadow-sm">
                    <div className="w-1/3 h-full bg-purple-500 p-1 flex flex-col gap-1">
                        <div className="w-8 h-8 rounded-full bg-white/20 mb-1"></div>
                        <div className="w-full h-1 bg-white/20 rounded"></div>
                        <div className="w-full h-1 bg-white/20 rounded"></div>
                    </div>
                    <div className="w-2/3 p-2 flex flex-col gap-1">
                        <div className="w-2/3 h-2 bg-purple-200 rounded mb-1"></div>
                        <div className="w-full h-1 bg-gray-100 rounded"></div>
                        <div className="w-full h-1 bg-gray-100 rounded"></div>
                    </div>
                </div>
            )
        },
        {
            id: 'minimalist',
            name: 'Classic Minimal',
            description: 'Timeless single-column design. Great for executive roles.',
            color: 'bg-stone-50 border-stone-200 hover:border-stone-500',
            iconColor: 'text-stone-600',
            preview: (
                <div className="w-full h-32 bg-white rounded border border-gray-100 p-3 flex flex-col gap-1 text-center relative overflow-hidden shadow-sm">
                    <div className="w-1/2 h-2 bg-gray-800 rounded mx-auto mb-1"></div>
                    <div className="w-full h-px bg-gray-200 mb-1"></div>
                    <div className="text-left flex flex-col gap-1">
                        <div className="w-full h-px bg-gray-300 rounded mb-1"></div>
                        <div className="w-full h-1 bg-gray-100 rounded"></div>
                        <div className="w-full h-px bg-gray-300 rounded mb-1 mt-1"></div>
                        <div className="w-3/4 h-1 bg-gray-100 rounded"></div>
                    </div>
                </div>
            )
        }
    ];

    const handleCreate = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep('editor');
            toast.success("Editor initialized!");
        }, 1000);
    };

    if (step === 'editor') {
        return <ResumeEditor selectedTemplate={selectedTemplate} onBack={() => setStep('selection')} />;
    }

    return (
        <div className='p-10'>
            <div className='flex items-center justify-between mb-8'>
                <div className='flex items-center gap-2'>
                    <h2 className='font-bold text-3xl'>Resume Builder</h2>
                    <FileSpreadsheet className='text-green-500 w-8 h-8' />
                </div>
                {selectedTemplate && (
                    <Button
                        onClick={handleCreate}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white gap-2 transition-all"
                    >
                        {loading ? <LoaderCircle className="animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                        Create Resume
                    </Button>
                )}
            </div>

            <p className='text-gray-500 mb-8'>Select a template to generate your AI-powered resume based on your interview results.</p>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                {templates.map((template) => (
                    <div
                        key={template.id}
                        onClick={() => setSelectedTemplate(template.id)}
                        className={`relative p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 group ${selectedTemplate === template.id
                                ? 'border-green-500 ring-2 ring-green-100 shadow-lg transform -translate-y-1'
                                : 'border-transparent bg-white shadow-sm hover:shadow-md hover:border-gray-200'
                            } ${selectedTemplate !== template.id ? template.color : 'bg-white'}`}
                    >
                        {selectedTemplate === template.id && (
                            <div className="absolute top-4 right-4 bg-green-500 text-white p-1 rounded-full shadow-sm z-10">
                                <Check className="w-4 h-4" />
                            </div>
                        )}

                        <div className="mb-4 pointer-events-none select-none">
                            {template.preview}
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                            <LayoutTemplate className={`w-5 h-5 ${template.iconColor}`} />
                            <h3 className="font-bold text-lg text-gray-800">{template.name}</h3>
                        </div>
                        <p className="text-sm text-gray-500 text-left">{template.description}</p>
                    </div>
                ))}
            </div>

            {/* Empty State / Hint */}
            {!selectedTemplate && (
                <div className="mt-12 text-center text-gray-400 text-sm">
                    Select a style above to get started
                </div>
            )}
        </div>
    );
};

export default ResumeBuilder;
