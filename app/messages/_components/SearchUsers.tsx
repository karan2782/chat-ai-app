"use client";
import { userMessageOpen } from "@/lib/reducers/messageSlice";
import { createChat } from "@/lib/thunks/messageThunk";
import { searchUsers } from "@/lib/thunks/userThunk";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const SearchUsers = () => {
  const [search, setSearch] = useState<any>("");
  const dispatch: any = useDispatch();
  const [users, setUsers] = useState([]);
  useEffect(() => {
    let timeId;
    timeId = setTimeout(async () => {
      const res = await dispatch(searchUsers(search));
      if (res.payload.status != false) {
        setUsers(res.payload.users);
      }
    }, 1000);

    return () => {
      clearTimeout(timeId);
    };
  }, [search]);

  const handleUserClick = async (data: any) => {
    const chat = await dispatch(createChat(data._id));
    if (chat.payload.status === false) return;
    dispatch(userMessageOpen(chat.payload.chat));
    setSearch("");
  };

  const initials = (name: string = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  return (
    <div className="relative w-full max-w-xs">
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100"
          placeholder="Search people..."
        />
      </div>

      {search.length > 0 && (
        <div className="scrollbar-thin absolute top-[44px] z-50 max-h-72 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/5">
          {users.length === 0 ? (
            <div className="px-3 py-6 text-center text-sm text-slate-400">
              No user found
            </div>
          ) : (
            <>
              {users?.map((user: any) => (
                <div
                  key={user._id}
                  className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-slate-100"
                  onClick={() => handleUserClick(user)}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-400 to-slate-500 text-xs font-semibold text-white">
                    {initials(user.fullName)}
                  </div>
                  <span className="truncate text-sm font-medium text-slate-700">
                    {user.fullName}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchUsers;
