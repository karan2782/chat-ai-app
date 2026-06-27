import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginUser = createAsyncThunk(
  "user/setUser",
  async ({ email, password }: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CHAT_API}/api/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );
      const data = await res.json();
      return data;
    } catch (error) {
      return error;
    }
  },
);

export const getUserChats = createAsyncThunk("user/chats", async () => {
  try {
    const res  = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API}/api/chats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
    } as any);
    const data = await res.json();
    return data;
  } catch (error) {
    return error;
  }
});

export const searchUsers = createAsyncThunk(
  "user/search",
  async (query: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CHAT_API}/api/user/search?q=${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        } as any,
      );
      const data = await res.json();
      console.log("search", data);
      return data;
    } catch (error: any) {
      return error.message;
    }
  },
);

export const getUserChat = createAsyncThunk(
  "user/getChat",
  async (userId: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_CHAT_API}/api/chat/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
          },
        } as any,
      );
      const data = await res.json();
      console.log(data);
      return data;
    } catch (error: any) {
      return error.message;
    }
  },
);

export const signupUser = createAsyncThunk("user/signup", async (data) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API}/api/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const user = await res.json();
    console.log('signup', user)
    return user;
  } catch (error: any) {
    return error.message;
  }
});
