'use client';

import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '../../../components/ui/dialog';
import { Textarea } from '../../../components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { Input } from '../../../components/ui/input';
import { chatSession } from '../../../utils/GeminiAIModal';
import { LoaderCircle } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../../../utils/db.js';
import { MockInterview } from '../../../utils/schema.js';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMode, setSelectedMode] = useState("Select Mode");
  const [selectedDuration, setSelectedDuration] = useState("Select Duration");
  const [selectedDifficulty, setSelectedDifficulty] = useState("");
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const InputPrompt = `You are an AI Interview Question Generator. Based on the following inputs, generate a structured mock interview.

Job Role: ` + jobPosition + `  
Job Description: ` + jobDescription + `  
Years of Experience: ` + jobExperience + `  
Interview Duration: ` + selectedDuration + `  
Candidate Location: ` + location + `  
Interview Difficulty: ` + selectedDifficulty + `

---

🎯 **Guidelines:**

1. **Question Distribution Based on Duration:**
   - 15 minutes → Generate **5** questions  
   - 30 minutes → Generate **10** questions  
   - 45 minutes → Generate **12** questions  
   - 60 minutes → Generate **15** questions  

2. **Question Categories:**
   - Ice Breaker  
   - Basic Skills  
   - Problem Solving  
   - Tech Core  
   - Aptitude  
   - Situational / General (e.g., “What would you do if…”)

3. **Distribution Based on Difficulty:**
   - **Basic:** Prioritize Ice Breaker, Basic Skills, Aptitude, and Situational  
   - **Intermediate:** Balanced coverage of all categories  
   - **Advanced:** Emphasize Problem Solving, Tech Core, and Situational

4. Provide answers along with the questions.

---

💡 Return the result in this JSON format:
{
  "interview": {
    "ice_breaker": [{ "question": "...", "answer": "..." }],
    "basic_skills": [{ "question": "...", "answer": "..." }],
    "problem_solving": [{ "question": "...", "answer": "..." }],
    "tech_core": [{ "question": "...", "answer": "..." }],
    "aptitude": [{ "question": "...", "answer": "..." }],
    "situational": [{ "question": "...", "answer": "..." }]
  }
}`;

// trimmed for clarity
    const result = await chatSession.sendMessage(InputPrompt);
    const MockJsonResp = result.response.text().replace('```json', '').replace('```', '');

    if (MockJsonResp) {
      const resp = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: MockJsonResp,
        jobPosition,
        jobDescription,
        jobExperience,
        selectedDifficulty,
        createdBy: 'admin',
        createdAt: moment().format('DD-MM-yyyy'),
      }).returning({ mockId: MockInterview.mockId });

      if (resp) {
        setOpenDialog(false);
        router.push(`/dashboard/interview/${resp[0]?.mockId}`);
      }
    }

    setLoading(false);
  };

  return (
    <div>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpenDialog(true)}
        className='p-10 border rounded-lg bg-secondary cursor-pointer shadow-sm hover:shadow-md transition-all'
      >
        <h2 className='text-lg text-center'>+ Add New</h2>
      </motion.div>

      <AnimatePresence>
        {openDialog && (
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className='max-w-3xl'>
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
              >
                <DialogHeader>
                  <DialogTitle className='text-2xl'>
                    Tell us about the job role to tailor your mock interview.
                  </DialogTitle>
                  <DialogDescription>
                    Add job title, description, location, working mode, and experience.
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={onSubmit}>
                  <div className='mt-2 my-2'>
                    <label>Job Position / Job Role</label>
                    <Input required placeholder="Ex. Full Stack Developer" value={jobPosition} onChange={(e) => setJobPosition(e.target.value)} />
                  </div>

                  <div className='mt-2 my-2'>
                    <label>Job Description (Short)</label>
                    <Textarea
                      required
                      rows={8}
                      maxLength={2000}
                      placeholder="Enter 8–10 lines (up to 2000 characters)"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                    />
                  </div>

                  <div className='my-2'>
                    <label>Years of Experience</label>
                    <Input type="number" required placeholder="Ex. 3" max="40" value={jobExperience} onChange={(e) => setJobExperience(e.target.value)} />
                  </div>

                  <div className='my-2'>
                    <label>Difficulty Level</label>
                    <Input required placeholder="Basic / Intermediate / Advanced" value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} />
                  </div>

                  <div className='my-2'>
                    <label>Location</label>
                    <Input required placeholder="Ex. Mumbai, Bangalore" value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>

                  <div className='flex gap-4 my-2'>
                    <div className='flex-1'>
                      <label className="block text-sm font-medium">Select Work Mode</label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button type="button" className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm">
                            {selectedMode}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {["Remote", "Online", "Offline", "Hybrid"].map((mode) => (
                            <DropdownMenuItem key={mode} onClick={() => setSelectedMode(mode)}>{mode}</DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className='flex-1'>
                      <label className="block text-sm font-medium">Interview Duration</label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button type="button" className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm">
                            {selectedDuration}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {["15 min", "30 min", "45 min", "60 min"].map((duration) => (
                            <DropdownMenuItem key={duration} onClick={() => setSelectedDuration(duration)}>{duration}</DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className='flex gap-5 justify-end mt-4'>
                    <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <LoaderCircle className="animate-spin w-4 h-4" />
                          Generating Interview...
                        </div>
                      ) : 'Start Interview'}
                    </Button>
                  </div>
                </form>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AddNewInterview;
