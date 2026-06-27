import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./reducers/chatSlice";
import messageReducer from "./reducers/messageSlice";
import userReducer from "./reducers/userSlice";

export const store : any = configureStore({
    reducer: {
        chat: chatReducer,
        message: messageReducer,
        user:userReducer,
    }
})