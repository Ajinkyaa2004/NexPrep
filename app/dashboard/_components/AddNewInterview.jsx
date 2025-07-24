'use client';
import React, { use } from 'react'
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
import { useState } from 'react';
import { Input } from '../../../components/ui/input';
import { chatSession } from '../../../utils/GeminiAIModal';
import { Loader, LoaderCircle } from 'lucide-react';

import { v4 as uuidv4 } from 'uuid';
import { db } from '../../../utils/db.js';
import { MockInterview } from '../../../utils/schema.js';
import * as schema from '../../../utils/schema.js';
import moment from 'moment';
import { useRouter } from 'next/navigation';



function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedMode, setSelectedMode] = useState("Select Mode")
  const [selectedDuration, setSelectedDuration] = useState("Select Duration")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const [jobPosition, setJobPosition] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [jobExperience, setJobExperience] = useState("")
  const [location, setLocation] = useState("")

  const [loading, setLoading] = useState(false);

  const [JsonResponse, setJsonResponse] = useState([]);

  const router=useRouter();

  // const {user}=useUser();

  const onSubmit = async (e) => {

    setLoading(true);
    e.preventDefault();
    console.log("Job Position:", jobPosition);
    console.log("Job Description:", jobDescription);
    console.log("Job Experience:", jobExperience);
    console.log("Work Mode:", selectedMode);
    console.log("Interview Duration:", selectedDuration);
    console.log("Difficulty Level:", selectedDifficulty);
    console.log("Location:", location);
    const InputPrompt = `You are an AI Interview Question Generator. Based on the following inputs, generate a structured mock interview.

Job Role: ${jobPosition}  
Job Description: ${jobDescription}  
Years of Experience: ${jobExperience}  
Interview Duration: ${selectedDuration}   
Interview Difficulty: ${selectedDifficulty}  


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

    const result = await chatSession.sendMessage(InputPrompt);
    const MockJsonResp = (result.response.text()).replace('```json', '').replace('```', '');
    console.log(JSON.parse(MockJsonResp));
    setJsonResponse(MockJsonResp);

    if (MockJsonResp) {

      console.log("MockJsonResp:", MockJsonResp.length);
      const resp = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: MockJsonResp,
        jobPosition: jobPosition,
        jobDescription: jobDescription,
        jobExperience: jobExperience,
        selectedDifficulty: selectedDifficulty,
        // location: location,
        createdBy: 'admin',  // temp default
        createdAt: moment().format('DD-MM-yyyy'),
      }).returning({ mockId: MockInterview.mockId });

      console.log("Inserted ID:", resp);
      if (resp) {
        setOpenDialog(false);
        router.push ('/dashboard/interview/'+resp[0]?.mockId)
      }
    }
    else {
      console.log('ERROR');
    }

    setLoading(false);
  }

  return (
    <div>
      <div
        className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
        onClick={() => setOpenDialog(true)}>
        <h2 className='text-lg text-center'>+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className='max-w-3xl'>
          <DialogHeader>
            <DialogTitle className='text-2xl'>Tell us about the job role to tailor your mock interview.</DialogTitle>
            <DialogDescription>
              Add job title, description, location, working mode, and experience.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSubmit}>
            <div className='mt-2 my-2'>
              <label>Job Position / Job Role</label>
              <Input placeholder="Ex. Full Stack Developer" required value={jobPosition} onChange={(event) => setJobPosition(event.target.value)} />
            </div>

            <div className='mt-2 my-2'>
              <label>Job Description / (in Short)</label>
              <Textarea maxLength={2000}
                rows={10}
                placeholder="Enter up to 8–10 lines (around 1000–2000 characters)" required value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} />
            </div>

            <div className='my-2'>
              <label>Years of Experience</label>
              <Input placeholder="Ex. 3" type="number" max="40" required value={jobExperience} onChange={(event) => setJobExperience(event.target.value)} />
            </div>

            <div className='my-2'>
              <label>Difficulty Level</label>
              <Input placeholder="Ex. Basic/Intermediate/Advance" required value={selectedDifficulty} onChange={(event) => setSelectedDifficulty(event.target.value)} />
            </div>

            <div className='mt-2 my-2'>
              <label>Location</label>
              <Input placeholder="Ex. Mumbai, Bangalore" required value={location} onChange={(event) => setLocation(event.target.value)} />
            </div>

            <div className="flex gap-4 my-2">
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium text-gray-700">Select Work Mode</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {selectedMode}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" className="w-full">
                    {["Remote", "Online", "Offline", "Hybrid"].map((mode) => (
                      <DropdownMenuItem key={mode} onClick={() => setSelectedMode(mode)}>
                        {mode}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex-1">
                <label className="mb-2 block text-sm font-medium text-gray-700">Interview Duration</label>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm bg-white text-gray-800 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {selectedDuration}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="bottom" className="w-full">
                    {["15 min", "30 min", "45 min", "60 min"].map((duration) => (
                      <DropdownMenuItem key={duration} onClick={() => setSelectedDuration(duration)}>
                        {duration}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <div className="flex gap-5 justify-end">
              <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>Cancel</Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                {loading ? (
                  <>
                    <LoaderCircle className='animate-spin' /> Generating Interview...
                  </>
                ) : 'Start Interview'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AddNewInterview;
