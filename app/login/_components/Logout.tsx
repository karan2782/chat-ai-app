'use client'
import { logoutUser } from '@/lib/reducers/userSlice'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useDispatch } from 'react-redux'

const Logout = () => {
    const dispatch = useDispatch()
    const router = useRouter()
    const handleLogout = ()=>{
        dispatch(logoutUser())
        router.push('/login')
    }
  return (
    <div>
      <button
      onClick={handleLogout}
       className='bg-blue-300 p-2 rounded-xl mt-1 cursor-pointer'>Logout</button>
    </div>
  )
}

export default Logout