'use client'
import React, { useEffect } from 'react'
import MessageBox from './_components/MessageBox'
import { useRouter } from "next/navigation";



const Home = () => {
    const router = useRouter();

    useEffect(()=>{
      if(!localStorage.getItem('token'))
         router.push('/login')
    }, [])
  return (
    <div className='flex h-full min-h-0 w-full flex-1'>
        <MessageBox />
    </div>
  )
}

export default Home