"use client";
import { userWrittenMessage } from "@/lib/reducers/chatSlice";
import { sendMessage } from "@/lib/thunks/chatThunk";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatMessageShow from "./ChatMessageShow";
import Logo from "./Logo";

const Chat = () => {
  const dispatch: any = useDispatch();
  const isSending = useSelector((state: any) =>
    state.chat.messages.some((m: any) => m.pending)
  );
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    const el = e.target;
    el.style.height = "auto"; // reset so it can shrink too
    el.style.height = `${el.scrollHeight}px`;
  };
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSend = () => {
    if (!message.trim() || isSending) return;
    dispatch(userWrittenMessage(message));
    dispatch(
      sendMessage({
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        message,
      })
    );
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };
  return (
    <div className="p-4 h-[100vh] flex flex-col">
      <header className="mb-4 pb-3 border-b">
        <Logo />
      </header>
      <div className="flex-1 overflow-y-auto mb-4">
        <ChatMessageShow />
      </div>
      <div className="flex w-full h-fit border-2 p-2 rounded-xl">
        <textarea
          ref={textareaRef}
          rows={1}
          className=" border-none focus:outline-none w-full max-h-[300px] min-h-[40px] resize-none overflow-y-auto block"
          value={message}
          onChange={handleChange}
        />
        <button
          className="border-2 rounded-md text-[14px] px-2 cursor-pointer h-[40px] self-end disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleSend}
          disabled={isSending}
        >
          {isSending ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default Chat;
