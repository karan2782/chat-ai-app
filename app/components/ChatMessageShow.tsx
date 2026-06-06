import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Tailwind preflight strips default element styles, so map markdown
// elements to styled equivalents here.
const mdComponents = {
  p: (props: any) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-5 mb-2 space-y-1" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-5 mb-2 space-y-1" {...props} />,
  li: (props: any) => <li className="leading-relaxed" {...props} />,
  h1: (props: any) => <h1 className="text-xl font-bold mb-2 mt-1" {...props} />,
  h2: (props: any) => <h2 className="text-lg font-bold mb-2 mt-1" {...props} />,
  h3: (props: any) => <h3 className="text-base font-bold mb-1 mt-1" {...props} />,
  a: (props: any) => (
    <a className="text-blue-600 underline" target="_blank" rel="noreferrer" {...props} />
  ),
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-gray-400 pl-3 italic my-2" {...props} />
  ),
  code: ({ inline, className, children, ...props }: any) =>
    inline ? (
      <code className="bg-black/10 rounded px-1 py-0.5 text-sm font-mono" {...props}>
        {children}
      </code>
    ) : (
      <code className={`${className ?? ""} font-mono text-sm`} {...props}>
        {children}
      </code>
    ),
  pre: (props: any) => (
    <pre
      className="bg-black/80 text-white rounded-md p-3 my-2 overflow-x-auto text-sm scrollbar-thin"
      {...props}
    />
  ),
  table: (props: any) => (
    <table className="border-collapse my-2 w-full text-sm" {...props} />
  ),
  th: (props: any) => (
    <th className="border border-gray-400 px-2 py-1 bg-black/5 text-left" {...props} />
  ),
  td: (props: any) => <td className="border border-gray-400 px-2 py-1" {...props} />,
};

const ChatMessageShow = () => {
  const chat = useSelector((state: any) => state.chat);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  return (
    <div className="h-full overflow-y-auto flex flex-col gap-2 scrollbar-thin">
      {chat?.messages?.map((message: any, index: number) => (
        <div
          className={`${
            message.role === "user"
              ? "self-end bg-blue-500 text-white"
              : message.error
              ? "self-start bg-red-100 text-red-700"
              : "self-start bg-gray-300 text-black"
          } p-2 rounded-lg max-w-[70%]`}
          key={message.id ?? index}
        >
          {message.pending ? (
            <span className="flex gap-1 items-center py-1">
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
            </span>
          ) : message.role === "user" || message.error ? (
            // user input + error text: render as plain text, not markdown
            <span className="whitespace-pre-wrap break-words">{message.content}</span>
          ) : (
            <div className="break-words">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {message.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessageShow;
