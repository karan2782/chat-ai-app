import { createAsyncThunk } from "@reduxjs/toolkit";

export const sendMessage = createAsyncThunk("chat/sendMessage",

    async({ message }: { id: string; message: string })=>{
        const res  = await fetch(`${process.env.NEXT_PUBLIC_CHAT_URL}/api/chat`,{
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({message})
        })
        const data = await res.json()
        console.log('data',data)
        return data
    }
)
