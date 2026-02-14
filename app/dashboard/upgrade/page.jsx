import React from 'react';
import { PartyPopper } from 'lucide-react';

const Upgrade = () => {
    return (
        <div className='p-10'>
            <div className='flex items-center gap-2 mb-5'>
                <h2 className='font-bold text-3xl'>Plans</h2>
                <PartyPopper className='text-yellow-500 w-8 h-8' />
            </div>
            <p className='text-gray-500'>We believe in accessible education for everyone.</p>

            <div className='mt-10 max-w-2xl mx-auto text-center p-10 border border-green-200 rounded-2xl bg-green-50 shadow-sm'>
                <h3 className='font-bold text-3xl text-green-700 mb-4'>Everything is Free!</h3>
                <p className='text-gray-700 text-lg mb-6'>
                    NexPrep AI is currently in early access. Enjoy unlimited mock interviews, detailed AI feedback, and all upcoming features at no cost.
                </p>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto'>
                    <div className='flex items-center gap-2'>
                        <span>✅</span> Unlimited Mock Interviews
                    </div>
                    <div className='flex items-center gap-2'>
                        <span>✅</span> Detailed AI Feedback
                    </div>
                    <div className='flex items-center gap-2'>
                        <span>✅</span> Resume Builder Access
                    </div>
                    <div className='flex items-center gap-2'>
                        <span>✅</span> Priority Support
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Upgrade;
