import { useEffect, useRef, useState } from "react";
import { Send, User, Users } from "lucide-react";

export default function Message() {
  const chats = [
    { id: "0", name: "Arjun", role: "Frontend Dev" },
    { id: "1", name: "Meera", role: "Backend Dev" },
    { id: "2", name: "DevSync Team", role: "Group" },
  ];

  const userId = "me";
  const [active, setActive] = useState("0");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const wsRef = useRef(null);
  const scrollRef = useRef(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (wsRef.current) wsRef.current.close();

    // Note: Update this URL to your production domain in deployment
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${active}/`);
    wsRef.current = ws;

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "message") {
        setMessages((prev) => [...prev, data]);
      }

      if (data.type === "typing") {
        setTyping(true);
        setTimeout(() => setTyping(false), 1200);
      }
    };

    return () => ws.close();
  }, [active]);

  const send = () => {
    if (!text.trim()) return;

    wsRef.current.send(
      JSON.stringify({
        type: "message",
        text,
        senderId: userId,
      })
    );
    setText("");
  };

  const startTyping = () => {
    wsRef.current.send(JSON.stringify({ type: "typing" }));
  };

  return (
    <div className="relative h-full w-full p-4 transition-colors duration-300">
      {/* Background layer with glassmorphism */}
      <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/40 pointer-events-none rounded-2xl" />

      <div className="relative z-10 h-full w-full flex gap-4">
        
        {/* CHATS PANEL */}
        <div className="w-[28%] flex flex-col bg-white/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all">
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-tighter">Messages</h2>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar py-2">
            {chats.map((c) => (
              <div
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`px-4 py-3 mx-2 mb-1 cursor-pointer rounded-xl transition-all flex items-center gap-3 ${
                  active === c.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-300"
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${active === c.id ? "bg-white/20" : "bg-slate-200 dark:bg-slate-700"}`}>
                   {c.role === "Group" ? <Users size={18} /> : <User size={18} />}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-sm truncate">{c.name}</p>
                  <p className={`text-[10px] uppercase font-semibold tracking-widest ${active === c.id ? "text-blue-100" : "text-slate-500"}`}>
                    {c.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MESSAGE PANEL */}
        <div className="flex-1 flex flex-col bg-white/90 dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-all">
          
          {/* HEADER */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <User size={16} />
               </div>
               <div>
                  <p className="font-bold text-slate-900 dark:text-white leading-none">
                    {chats.find((c) => c.id === active)?.name}
                  </p>
                  {typing && (
                    <span className="text-[10px] font-bold text-blue-500 animate-pulse">
                      typing...
                    </span>
                  )}
               </div>
            </div>
          </div>

          {/* MESSAGES AREA */}
          <div ref={scrollRef} className="flex-1 px-6 py-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/20 no-scrollbar">
            {messages.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center opacity-20 dark:opacity-10 grayscale">
                  <MessageSquare size={64} className="mb-2" />
                  <p className="text-sm font-bold uppercase tracking-widest">No messages yet</p>
               </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex ${m.senderId === userId ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm shadow-sm transition-all duration-300 ${
                      m.senderId === userId
                        ? "bg-blue-600 text-white rounded-tr-none shadow-blue-500/10"
                        : "bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700 rounded-tl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* INPUT AREA */}
          <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex gap-3 max-w-5xl mx-auto">
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={(e) => {
                   startTyping();
                   if (e.key === "Enter") send();
                }}
                placeholder="Type a message..."
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950 px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder-slate-400 dark:placeholder-slate-600"
              />
              <button
                onClick={send}
                className="px-5 rounded-xl text-white bg-blue-600 hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-600/20 flex items-center justify-center"
              >
                <Send size={18} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Internal helper for empty state icon
const MessageSquare = ({ size, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} height={size} 
    viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" 
    strokeLinecap="round" strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);