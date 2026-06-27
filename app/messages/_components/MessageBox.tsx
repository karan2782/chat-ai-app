"use client";
import { setUser } from "@/lib/reducers/userSlice";
import { messagesOfChat } from "@/lib/thunks/messageThunk";
import { getUserChats } from "@/lib/thunks/userThunk";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";
import ShowMessages from "./ShowMessages";
import {
  clearAllMessages,
  setChatMessages,
  userMessageOpen as setUserMessageOpen,
} from "@/lib/reducers/messageSlice";

const MessageBox = () => {
  const [message, setMessage] = useState<any>("");
  const [socketId, setSocketId] = useState<any>("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [typing, setTyping] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<any>([]);
  const messageInputRef = useRef<any>(null);
  const socket = useMemo(() => io(process.env.NEXT_PUBLIC_CHAT_API), []);
  const {
    userMessageOpen,
    allMessagesOfChat,
    allMessagesOfChatLoading,
    allMessagesOfChatError,
  } = useSelector((state: any) => state.message);
  const dispatch: any = useDispatch();
  const { user: mainUser } = useSelector((state: any) => state.user);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    let user;
    if (!token) {
      router.replace("/login");
      return;
    } else {
      user = token ? jwtDecode(token || "") : "";
      if (!user) {
        router.replace("/login");
        return;
      }
    }

    dispatch(setUser(user));
  }, []);

  useEffect(() => {
    if (!mainUser?.id) return;

    socket.emit("user-online", mainUser?.id);
  }, [mainUser?.id]);

  useEffect(() => {
    socket.on("online-users", (data) => {
      setOnlineUsers(data);
      console.log("online users", data);
    });
  }, [socket]);

  useEffect(() => {
    dispatch(messagesOfChat(userMessageOpen?._id));

    return () => {
      dispatch(clearAllMessages());
    };
  }, [userMessageOpen?._id]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server with id: ", socket.id);
      setSocketId(socket.id);
    });

    socket.on("message", (data) => {
      console.log("Message from server: ", data);

      if (mainUser?.id && userMessageOpen?.id) {
        socket.emit("opened-chat", {
          userId: mainUser?.id,
          chatId: userMessageOpen?._id,
        });
      }

      dispatch(setChatMessages(data.newMessage));
      dispatch(getUserChats());
    });

    return () => {
      socket.off("connect");
      socket.off("message");
    };
  }, [socket, mainUser?.id, userMessageOpen?.id]);

  useEffect(() => {
    socket.on("typing", (data) => {
      setTyping(data);
    });

    socket.on("stopTyping", (data) => {
      setTyping(null);
    });

    return () => {
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [socket]);

  useEffect(() => {
    if (!userMessageOpen || !userMessageOpen?._id) return;

    socket.emit("join-room", userMessageOpen._id);
    console.log("Joined room:", userMessageOpen._id, userMessageOpen);
    socket.emit("opened-chat", {
      userId: mainUser?.id,
      chatId: userMessageOpen?._id,
    });

    return ()=>{
      socket.emit('closed-chat', {userId:mainUser?.id})
    }

  }, [socket, userMessageOpen?._id, mainUser?.id]);

  const handleMessageInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Handle message input change
    setMessage(e.target.value);
    const el = e.target;
    el.style.height = "auto"; // reset so it can shrink too
    el.style.height = `${el.scrollHeight}px`;

    let typingTimeout: any;

    socket.emit("typing", { roomId: userMessageOpen._id, sender: mainUser });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", {
        roomId: userMessageOpen._id,
        sender: mainUser,
      });
    }, 1000);
  };

  const handleSendMessage = () => {
    // Handle sending message
    if (message.trim() === "") return; // Don't send empty messages
    const newMessage: any = {
      chat: userMessageOpen._id,
      sender: mainUser.id,
      receiver: userMessageOpen.members[0]._id,
      content: message,
    };
    // dispatch(setChatMessages(newMessage));
    socket.emit("message", { roomId: userMessageOpen._id, newMessage });
    setMessage(""); // Clear the input after sending
    dispatch(getUserChats());
    if (messageInputRef.current) {
      messageInputRef.current.style.height = "auto";
    }
  };

  const peer = userMessageOpen?.members?.filter(
    (m: any) => m?._id !== mainUser?.id,
  )[0];
  const peerName = peer?.fullName;
  const peerInitials =
    (peerName || "")
      .split(" ")
      .map((n: string) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";
  const isTyping = typing && typing.sender.id !== mainUser?.id;

  return (
    <>
      {userMessageOpen ? (
        <div className="flex h-full w-full flex-col bg-slate-50">
          {/* Conversation header */}
          <div className="flex shrink-0 items-center gap-3 border-b border-slate-200 bg-white/80 px-3 py-3 backdrop-blur sm:px-5">
            <button
              type="button"
              onClick={() => dispatch(setUserMessageOpen(null))}
              className="-ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 active:scale-95 sm:hidden"
              aria-label="Back to chats"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-semibold text-white shadow-sm">
              {peerInitials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">
                {peerName}{" "}
                <span className="text-xs text-slate-400">
                  {onlineUsers.includes(peer?._id) ? "online 🟢" : "offline ⚫️"}
                </span>
              </p>
              <p className="h-4 text-xs text-indigo-500">
                {isTyping && (
                  <span className="inline-flex items-center gap-1">
                    {typing.sender.name.split(" ")[0]} is typing
                    <span className="inline-flex gap-0.5">
                      <span className="h-1 w-1 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.3s]" />
                      <span className="h-1 w-1 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.15s]" />
                      <span className="h-1 w-1 animate-bounce rounded-full bg-indigo-400" />
                    </span>
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div
            className="scrollbar-thin min-h-0 w-full flex-1 overflow-y-auto"
            ref={messagesContainerRef}
          >
            <ShowMessages
              allMessagesOfChat={allMessagesOfChat}
              sender={mainUser?.id}
            />
          </div>

          {/* Composer */}
          <div className="shrink-0 border-t border-slate-200 bg-white px-4 py-3">
            <div className="flex items-end gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-1.5 transition focus-within:border-indigo-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100">
              <textarea
                ref={messageInputRef}
                onChange={handleMessageInput}
                value={message}
                rows={1}
                className="scrollbar-thin block max-h-[200px] w-full resize-none bg-transparent px-3 py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                placeholder="Type your message here..."
              />
              <button
                onClick={handleSendMessage}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm transition hover:opacity-90 active:scale-95"
                aria-label="Send"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-slate-50 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600">No chat open</p>
            <p className="mt-1 text-xs text-slate-400">
              Select a conversation to start messaging
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default MessageBox;
