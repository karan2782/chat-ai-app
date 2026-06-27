import { clearAllListeners, createSlice } from "@reduxjs/toolkit";
import { messagesOfChat } from "../thunks/messageThunk";

const initialState : any = {
  userMessageOpen: null,
  allMessagesOfChat:[],
  allMessagesOfChatLoading:false,
  allMessagesOfChatError:null,
  unreadMessages:0, 
  unreadMessagesLoading:false,
  unreadMessagesError:null
};
const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    userMessageOpen: (state, action) => {
      state.userMessageOpen = action.payload;
    },
    setChatMessages: (state : any, action:any)=>{
      state.allMessagesOfChat.push(action.payload)
    },
    clearAllMessages: (state)=>{
      state.allMessagesOfChat = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(messagesOfChat.pending, (state)=>{
      state.allMessagesOfChatLoading = true;
      state.allMessagesOfChatError = null;
    })

    builder.addCase(messagesOfChat.fulfilled, (state, action)=>{
      state.allMessagesOfChat = action.payload.data;
      state.allMessagesOfChatLoading = false;
      state.allMessagesOfChatError = null;
    })

    builder.addCase(messagesOfChat.rejected, (state, action)=>{
      state.allMessagesOfChatLoading = false;
      state.allMessagesOfChatError = action.payload;
    })

  }
});

export const { userMessageOpen, clearAllMessages , setChatMessages} = messageSlice.actions;
export default messageSlice.reducer;
