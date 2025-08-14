import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react';

function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex }) {
  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);


      const voices = window.speechSynthesis.getVoices();


      const selectedVoice =
        voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('female')) ||
        voices.find(v => v.lang === 'en-us') ||
        voices[0]; 

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      window.speechSynthesis.speak(utterance);
    } else {
      alert('Sorry, your browser does not support text-to-speech.');
    }
  };

  return mockInterviewQuestion && (
    <div className='p-5 border rounded-lg my-12 '>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
        {mockInterviewQuestion.map((_, index) => (
          <h2
            key={index}
            className={`p-2 rounded-full text-xs md:text-sm text-center cursor-pointer
            ${activeQuestionIndex === index ? 'bg-blue-500 text-white' : 'bg-secondary'}`}
          >
            Question {index + 1}
          </h2>
        ))}
      </div>

      <div className='flex items-center gap-2 my-'>
        <h2 className='text-md md:text-lg'>
          {mockInterviewQuestion[activeQuestionIndex]?.question}
        </h2>
        <Volume2
          className='cursor-pointer text-blue-500 hover:text-blue-700 mt-20 mr-1 size-8'
          onClick={() => textToSpeech(mockInterviewQuestion[activeQuestionIndex]?.question)}
        />
      </div>

      <div className='border rounded-lg p-5 bg-blue-100 mt-10'>
        <h2 className='flex gap-2 items-center text-blue-400'>
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <h2 className='text-sm text-black my-2'>
          {process.env.NEXT_PUBLIC_QUESTION_NOTE}
        </h2>
      </div>
    </div>
  );
}

export default QuestionsSection;
