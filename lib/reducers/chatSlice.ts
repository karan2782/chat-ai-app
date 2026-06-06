import { createSlice } from "@reduxjs/toolkit";
import { sendMessage } from "../thunks/chatThunk";

const initialState : any = {
    messages: [],
    loading: false,
    error:null
}

const chatSlice = createSlice({
    name:'chat',
    initialState,
    reducers: {
        userWrittenMessage: (state, action) => {
            state.messages.push({
                role:'user',
                content: action.payload
            })
        }
    },
    extraReducers: (builder) => {
        builder.addCase(sendMessage.pending, (state, action) => {
            state.error = null;
            // push a per-message placeholder that is loading on its own,
            // so the rest of the list stays interactive
            state.messages.push({
                id: action.meta.arg.id,
                role: 'assistant',
                content: '',
                pending: true,
            })
        })
        builder.addCase(sendMessage.fulfilled, (state, action) => {
            const placeholder = state.messages.find(
                (m: any) => m.id === action.meta.arg.id
            );
            if (placeholder) {
                placeholder.content = action.payload.message.content;
                placeholder.pending = false;
            }
        })
        builder.addCase(sendMessage.rejected, (state, action) => {
            const placeholder = state.messages.find(
                (m: any) => m.id === action.meta.arg.id
            );
            if (placeholder) {
                placeholder.pending = false;
                placeholder.error = true;
                placeholder.content = "Failed to send message";
            }
            state.error = action.error.message || "Failed to send message";
        })
    }
})

export const { userWrittenMessage } = chatSlice.actions
export default chatSlice.reducer