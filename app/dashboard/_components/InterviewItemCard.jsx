import React from 'react'
import { Button } from '../../../components/ui/button'
import { useRouter } from 'next/navigation'

function InterviewItemCard({interview}) {

  const router = useRouter();

  const onStart=()=>{
    router.push('/dashboard/interview/'+interview?.mockId)
    
  }
  const onFeedbackPress=()=>{
    router.push('/dashboard/interview/'+interview?.mockId+'/feedback')
  }

  return (
    <div className='border shadow-sm rounded-lg p-3 '>
        <h2 className='font-extrabold text-blue-500 text-xl'>{interview?.jobPosition}</h2>
        <h2 className='text-sm text-gray-600 mt-1'>{interview?.jobExperience} - Years of Experience</h2>
        <h2 className='text-xs text-gray-500 ' >Created At: {interview.createdAt}</h2>
        <div className='flex justify-between mt-5 gap-5'>
          <Button size='sm' variant='outline' className='w-35' onClick={onFeedbackPress}>Feedback</Button>
          <Button size='sm' className='w-35' onClick={onStart}> Retake </Button>
        </div>

    </div>
  )
}

export default InterviewItemCard