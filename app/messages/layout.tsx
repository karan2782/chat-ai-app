"use client";

import { useSelector } from "react-redux";
import Logout from "../login/_components/Logout";
import SearchUsers from "./_components/SearchUsers";
import Users from "./_components/Users";

const MessageLayout = ({ children }: any) => {
  // On mobile we show a single pane at a time: the chat list when no
  // conversation is open, and the conversation when one is. On sm+ both panes
  // are always visible side by side.
  const chatOpen = useSelector(
    (state: any) => !!state.message?.userMessageOpen,
  );

  return (
    <div className="flex h-dvh flex-col bg-slate-100">
      {/* Top bar */}
      <header className="relative z-50 flex h-16 w-full shrink-0 items-center justify-between gap-4 border-b border-slate-200 bg-white/80 px-4 backdrop-blur sm:px-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-sm">
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
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight text-slate-800">
            Messages
          </span>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
          <SearchUsers />
          <Logout />
        </div>
      </header>

      {/* Body */}
      <div className="flex min-h-0 w-full flex-1">
        {/* Sidebar / chat list */}
        <aside
          className={`${
            chatOpen ? "hidden" : "flex"
          } w-full shrink-0 flex-col border-r border-slate-200 bg-white/60 sm:flex sm:w-72 md:w-80`}
        >
          <Users />
        </aside>

        {/* Conversation */}
        <main
          className={`${
            chatOpen ? "flex" : "hidden"
          } min-w-0 flex-1 flex-col bg-slate-50 sm:flex`}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default MessageLayout;
