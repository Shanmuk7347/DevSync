import { useState } from "react";

export default function Message() {
  const chats = [
    { name: "Arjun", role: "Frontend Dev", last: "Let’s connect" },
    { name: "Meera", role: "Backend Dev", last: "API done" },
    { name: "DevSync Team", role: "Group", last: "Sprint review" },
  ];

  const [active, setActive] = useState(0);
  const [messages, setMessages] = useState([
    { text: "Hi, interested in collaborating?", me: false },
    { text: "Yes! Let’s do it 🚀", me: true },
  ]);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setMessages([...messages, { text, me: true }]);
    setText("");
  };

  return (
    <div className="h-[85vh] w-full bg-white/80 backdrop-blur rounded-xl shadow-md flex overflow-hidden">

      {/* Conversations */}
      <div className="w-[30%] border-r bg-gray-50">
        <div className="p-4 font-semibold text-lg">Messages</div>

        <div className="flex flex-col">
          {chats.map((c, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              className={`px-4 py-3 cursor-pointer hover:bg-gray-200 ${
                active === i && "bg-gray-200"
              }`}
            >
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-gray-500">{c.role}</p>
              <p className="text-sm text-gray-600 truncate">{c.last}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col w-[70%]">

        {/* Header */}
        <div className="p-4 border-b font-medium">
          {chats[active].name}
          <span className="text-sm text-gray-500 ml-2">
            • {chats[active].role}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-100">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[65%] px-4 py-2 rounded-lg text-sm ${
                m.me
                  ? "ml-auto bg-blue-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-3 border-t bg-white flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Message..."
            className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
          />
          <button
            onClick={send}
            className="bg-blue-500 text-white px-4 rounded-lg text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
