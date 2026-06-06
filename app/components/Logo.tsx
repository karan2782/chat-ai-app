const Logo = () => {
  return (
    <div className="flex items-center gap-2 select-none">
      {/* chat-bubble accent mark */}
      <span className="relative flex items-center justify-center w-8 h-8 rounded-xl rounded-bl-sm bg-blue-500 text-white text-sm font-bold shadow-sm">
        C
      </span>
      {/* wordmark */}
      <span className="text-2xl font-bold tracking-tight">
        <span className="text-gray-900">Chat</span>
        <span className="text-blue-500">Ai</span>
      </span>
    </div>
  );
};

export default Logo;
