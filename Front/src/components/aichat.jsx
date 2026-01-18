import React, { useState } from "react";

export default function AIChat() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Hi! I’m DevSync AI. Ask me about projects, tech stacks, or ideas.",
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: input },
      { role: "ai", text: "I can help you analyze your tech stack or brainstorm new project features. What's on your mind?" },
    ]);
    setInput("");
  };

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden">
      {/* Background Overlay for Glassmorphism */}
      <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/40 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 p-6 border-b border-white/20 dark:border-slate-700/50 backdrop-blur-md">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Assistant</h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Get instant help with projects, code, and tech decisions.
        </p>
      </div>

      {/* Chat Messages Container */}
      <div className="relative z-10 flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed transition-colors duration-300 ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-tr-none"
                  : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="relative z-10 p-6 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-t border-white/20 dark:border-slate-700/50">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
          />

          <button
            onClick={sendMessage}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}