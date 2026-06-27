import { getUserChats } from "./userThunk";

const { createAsyncThunk } = require("@reduxjs/toolkit");

export const messagesOfChat = createAsyncThunk(
  "message/chat",
  async (chatId: any, thunkAPI:any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CHAT_API}/api/message/${chatId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        },
      );
      const data = await res.json();
      console.log("get messages", data);
      thunkAPI.dispatch(getUserChats())
      return data;
    } catch (error: any) {
      return error.message;
    }
  },
);

export const createChat = createAsyncThunk(
  "message/createChat",
  async (userId: string, thunkAPI:any) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({ id: userId }),
      });
      const data = await res.json();
      console.log("create chat", data);
      thunkAPI.dispatch(getUserChats())
      return data;
    } catch (error: any) {
      return error.message;
    }
  },
);


