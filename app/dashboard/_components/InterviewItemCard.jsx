import React from 'react'
import { Button } from '../../../components/ui/button'
import { useRouter } from 'next/navigation'

function InterviewItemCard({ interview }) {
  const router = useRouter();

  const onStart = () => {
    router.push('/dashboard/interview/' + interview?.mockId)
  }

  const onFeedbackPress = () => {
    router.push('/dashboard/interview/' + interview?.mockId + '/feedback')
  }

  return (
    <div className='border shadow-sm rounded-lg p-4 hover:shadow-lg transition-shadow duration-200'>
      <h2 className='font-extrabold text-blue-500 text-xl truncate'>{interview?.jobPosition}</h2>
      <h2 className='text-sm text-gray-600 mt-1 truncate'>{interview?.jobExperience} - Years of Experience</h2>
      <h2 className='text-xs sm:text-sm text-gray-500 truncate'>Created At: {interview.createdAt}</h2>

      {/* Buttons Section - Always Horizontal */}
      <div className='flex justify-between mt-5 gap-3 flex-wrap'>
        <Button
          size='sm'
          variant='outline'
          className='flex-1 min-w-[120px]'
          onClick={onFeedbackPress}
        >
          View Feedback
        </Button>
        <Button
          size='sm'
          className='flex-1 min-w-[120px] bg-blue-600 hover:bg-blue-700 text-white'
          onClick={onStart}
        >
          Retake
        </Button>
      </div>
    </div>
  )
}

export default InterviewItemCard
