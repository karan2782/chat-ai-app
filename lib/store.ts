import { configureStore } from "@reduxjs/toolkit";
import chatReducer from "./reducers/chatSlice";

export const store : any = configureStore({
    reducer: {
        chat: chatReducer
    }
})