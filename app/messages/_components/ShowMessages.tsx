import React, { useEffect, useRef } from "react";

interface Props {
  allMessagesOfChat: any;
  sender: string;
}
const ShowMessages = ({ allMessagesOfChat, sender }: Props) => {
  const bottomRef : any = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behaviour: "smooth",
    });
  }, [allMessagesOfChat]);
  return (
    <div className="flex flex-col gap-2 px-4 py-4">
      {allMessagesOfChat?.length === 0 && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <p className="text-sm text-slate-400">No messages yet — say hello 👋</p>
        </div>
      )}

      {allMessagesOfChat?.map((message: any) => {
        const isMine = sender === message.sender;
        return (
          <div
            key={message._id}
            className={`flex w-full ${isMine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] whitespace-pre-wrap break-words rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm ${
                isMine
                  ? "rounded-br-md bg-gradient-to-br from-indigo-500 to-violet-600 text-white"
                  : "rounded-bl-md border border-slate-200 bg-white text-slate-700"
              }`}
            >
              {message.content}
            </div>
          </div>
        );
      })}
      <div ref={bottomRef}></div>
    </div>
  );
};

export default ShowMessages;
