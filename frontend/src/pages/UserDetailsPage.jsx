import React from 'react'
import BaseLayout from '../components/BaseLayout'
import StepForm from '../components/StepForm'

const UserDetailsPage = () => {
  return (
    <div className='max-w-screen h-full bg-white mx-auto'>
        <h1 className="text-gradient3 mt-10 font-black text-3xl text-center">User Details</h1>
        <StepForm />
    </div>
  )
}

export default UserDetailsPage