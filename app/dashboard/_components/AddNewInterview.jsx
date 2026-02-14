'use client';
import { auth } from '../../../firebase/client';

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
import { createInterview } from '../../actions/interview';
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

  const [errorMsg, setErrorMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = auth.currentUser;
    const InputPrompt = `You are an AI Interview Question Generator. Based on the following inputs, generate a structured mock interview.

Job Role: ` + jobPosition + `  
Job Description: ` + jobDescription + `  
Years of Experience: ` + jobExperience + `  
Interview Duration: ` + selectedDuration + `  
Candidate Location: ` + location + `  
Interview Difficulty: ` + selectedDifficulty + `

---

🎯 **Guidelines:**

1. **Question Count by Duration** (total questions):
   - 15 minutes → 5 questions  
   - 30 minutes → 7 questions  
   - 45 minutes → 9 questions  
   - Never create number of questions more than 9.

2. **Question Categories**:
   - ice_breaker  
   - basic_skills  
   - problem_solving  
   - tech_core  
   - aptitude  
   - situational  

3. **Difficulty Distribution Rules**:
   - **Basic** → Focus more on: ice_breaker, basic_skills, aptitude, situational (at least 1 from each).  
   - **Intermediate** → Distribute evenly across all categories; include **1–2 ice_breaker questions**; at least 1 from each other category.  
   - **Advanced** → Focus more on: problem_solving, tech_core, situational; include **1–2 ice_breaker questions**; at least 1 from each other category.  
   - **Never ask more than 9 questions**.

4. **No Empty Categories**:
   - If total questions are less than total categories, pick categories according to the difficulty priority first, then fill remaining slots with other categories.
   - Always include at least 1 question in each priority category for the chosen difficulty.

5. **Answers**:
   - Keep answers short, clear, and relevant to the role and JD.
   - For coding/technical answers, keep them brief (≤3 lines of pseudocode or explanation).

6. **Output**:
   - Striclty return only valid JSON in the following format:

💡 **JSON Format**:
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
    try {
      const result = await chatSession.sendMessage(InputPrompt);
      console.log(result);
      const MockJsonResp = result.response.text().replace('```json', '').replace('```', '');

      if (MockJsonResp) {
        const result = await createInterview({
          mockId: uuidv4(),
          jsonMockResp: MockJsonResp,
          jobPosition,
          jobDescription,
          jobExperience,
          selectedDifficulty,
          selectedDuration,
          createdBy: user?.email || 'unknown',
          createdAt: moment().format('DD-MM-yyyy'),
        });

        if (result.success) {
          setOpenDialog(false);
          router.push(`/dashboard/interview/${result.mockId}`);
        }
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("⚠️ Our AI engine is busy right now. Please try again in a few minutes.");
      setTimeout(() => setErrorMsg(""), 5000); // hide after 5s
    }

    setLoading(false);
  };

  return (
    <div>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setOpenDialog(true)}
        className='p-8 rounded-2xl bg-gradient-to-br from-primary to-secondary cursor-pointer shadow-lg shadow-primary/20 hover:shadow-[0_0_25px_rgba(74,108,255,0.4)] transition-all group relative overflow-hidden ring-0 hover:ring-2 ring-accent/50'
      >
        <div className="flex items-center justify-between">
          <div className="text-left">
            <h2 className='text-xl font-bold text-white mb-2'>Create New Interview</h2>
            <p className="text-white/80 text-sm">Start your AI-powered assessment</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white group-hover:text-primary transition-colors">
            <span className="text-2xl font-light">+</span>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {openDialog && (
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogContent className='w-full max-w-xs sm:max-w-sm md:max-w-3xl lg:max-w-4xl max-h-[83vh] sm:max-h-[85vh] md:max-h-[90vh] lg:max-h-[95vh] overflow-auto'>
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
                      rows={6}
                      maxLength={4000}
                      placeholder="Enter 8–10 lines (up to 2000 characters)"
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="resize-none overflow-y-auto max-h-60 sm:max-h-30 md:max-h-60 lg:max-h-55 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className='my-2'>
                    <label>Years of Experience</label>
                    <Input type="number" required placeholder="Ex. 3" max="40" value={jobExperience} onChange={(e) => setJobExperience(e.target.value)} />
                  </div>

                  <div className='my-2'>
                    <label className="block text-sm font-medium mb-1">Difficulty Level</label>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button type="button" className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm text-left flex justify-between items-center">
                          {selectedDifficulty || "Select Difficulty"}
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        {["Basic", "Intermediate", "Advanced"].map((level) => (
                          <DropdownMenuItem key={level} onClick={() => setSelectedDifficulty(level)}>
                            {level}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className='my-2'>
                    <label>Location</label>
                    <Input required placeholder="Ex. Mumbai, Bangalore" value={location} onChange={(e) => setLocation(e.target.value)} />
                  </div>

                  <div className='flex gap-4 my-2 flex-wrap'>
                    <div className='flex-1 min-w-[140px]'>
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

                    <div className='flex-1 min-w-[140px]'>
                      <label className="block text-sm font-medium">Interview Duration</label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button type="button" className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm">
                            {selectedDuration}
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          {["15 min", "30 min", "45 min"].map((duration) => (
                            <DropdownMenuItem key={duration} onClick={() => setSelectedDuration(duration)}>{duration}</DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {errorMsg && (
                    <div className="mb-4 bg-red-100 text-red-700 px-4 py-2 rounded-md text-sm border border-red-300">
                      {errorMsg}
                    </div>
                  )}

                  <div className='flex gap-5 justify-end mt-4 flex-wrap'>
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
