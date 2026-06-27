import { createSlice } from "@reduxjs/toolkit";
import { getUserChats, loginUser, signupUser } from "../thunks/userThunk";
import { jwtDecode } from "jwt-decode";

const initialState: any = {
  user: null,
  error: null,
  loading: false,
  userChats: null,
  userChatLoading: false,
  userChatError: null,
  userRegistered: false,
  userRegisteredError: null,
  userResgisteredLoading: false,
};
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logoutUser: (state: any) => {
      state.user = null;
      state.error = null;
      state.loading = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state, action) => {
      state.error = null;
      state.loading = true;
      // push a per-message placeholder that is loading on its own,
      // so the rest of the list stays interactive
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      localStorage.setItem("token", action.payload.token);
      const user = jwtDecode(action.payload.token);
      state.user = user;
      state.error = null;
      state.loading = false;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.error = action.payload;
      state.loading = false;
    });

    builder.addCase(getUserChats.pending, (state, action) => {
      state.userChatLoading = true;
      state.userChatError = null;
    });
    builder.addCase(getUserChats.fulfilled, (state, action) => {
      const user: any = jwtDecode(localStorage.getItem("token") || "");
      const chats = action?.payload?.data?.map((chat: any) => ({
        ...chat,
        members: chat.members.filter((member: any) => member._id != user.id),
      }));
      state.userChats = chats;
      state.userChatLoading = false;
      state.userChatError = null;
    });
    builder.addCase(getUserChats.rejected, (state, action) => {
      state.userChatLoading = false;
      state.userChatError = action.payload;
    });

    builder.addCase(signupUser.pending, (state, action) => {
      state.error = null;
      state.loading = true;
    });

    builder.addCase(signupUser.fulfilled, (state, action) => {
      console.log("signup reducer", action.payload);
      if (action.payload.status === false) {
        state.userRegistered = false;
        state.userRegisteredError = action.payload.error;
        state.userResgisteredLoading = false;

        return;
      }
      state.userRegistered = true;
      state.userRegisteredError = null;
      state.userResgisteredLoading = false;
    });

    builder.addCase(signupUser.rejected, (state, action) => {
      state.userRegistered = false;
      state.userRegisteredError = action.payload;
      state.userResgisteredLoading = false;
    });
  },
});

export const { setUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
