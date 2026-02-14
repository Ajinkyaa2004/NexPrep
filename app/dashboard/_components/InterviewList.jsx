"use client";
import React, { useEffect, useState } from 'react';
import { getInterviewList } from '../../actions/interview';
import { auth } from '../../../firebase/client';
import InterviewItemCard from '../_components/InterviewItemCard';



function InterviewList() {
  const [interviewList, setInterviewList] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        GetInterviewList(user.email);
      }
    });
    return () => unsubscribe();
  }, []);

  const GetInterviewList = async (email) => {
    const result = await getInterviewList(email);
    console.log(result);
    setInterviewList(result);
  };

  return (
    <div>
      <h2 className="font-bold text-xl my-10">Previous Mock Interview</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-5'>
        {interviewList && interviewList.map((interview, index) => (
          <InterviewItemCard
            interview={interview}
            key={index} />
        ))}
      </div>
    </div>
  );
}

export default InterviewList;
