"use client";
import { userMessageOpen } from "@/lib/reducers/messageSlice";
import { getUserChats } from "@/lib/thunks/userThunk";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Users = () => {
  const message = useSelector((state: any) => state.message);
  const dispatch: any = useDispatch();

  const { userChats, user: mainUser } = useSelector((state: any) => state.user);
  console.log("user main", userChats, mainUser);

  useEffect(() => {
    dispatch(getUserChats());
  }, [dispatch]);

  const handleUserClick = (data: any) => {
    console.log(data);
    dispatch(userMessageOpen(data));
  };

  const activeId = message?.userMessageOpen?._id;

  const initials = (name: string = "") =>
    name
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Chats
        </h2>
        {userChats?.length ? (
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
            {userChats.length}
          </span>
        ) : null}
      </div>

      <ul className="scrollbar-thin flex-1 space-y-1 overflow-y-auto px-2 pb-3">
        {userChats?.length ? (
          userChats.map((chat: any) => {
            const name = chat.members[0].fullName;
            const isActive = activeId === chat._id;
            return (
              <li
                key={chat._id}
                onClick={() => handleUserClick(chat)}
                className={`group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 transition-colors ${
                  isActive
                    ? "bg-indigo-50 ring-1 ring-inset ring-indigo-100"
                    : "hover:bg-slate-100"
                }`}
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white shadow-sm ${
                    isActive
                      ? "bg-gradient-to-br from-indigo-500 to-violet-600"
                      : "bg-gradient-to-br from-slate-400 to-slate-500"
                  }`}
                >
                  {initials(name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p
                    className={`truncate text-sm font-medium ${
                      isActive ? "text-indigo-900" : "text-slate-700"
                    } flex items-center justify-between`}
                  >
                    {name}{" "}
                    <span className="text-xs font-bold">
                      {chat?.unreadMessages}
                    </span>
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    Tap to open conversation
                  </p>
                </div>
              </li>
            );
          })
        ) : (
          <li className="px-3 py-10 text-center text-sm text-slate-400">
            No conversations yet
          </li>
        )}
      </ul>
    </div>
  );
};

export default Users;
