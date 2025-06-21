import React, { useState } from "react";

const GEMINI_API_KEY = "AIzaSyB3LZqGp-gipoSasch2mzvVqVShn5J7bIs";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

const SYSTEM_PROMPT = "You are being used as a support for SmartBus app. Answer only app-related queries. Keep replies short, to the point, and do not use asterisks or AI symbols.";
const QUICK_REPLIES = [
  "How to book a bus?",
  "How to apply a coupon?",
  "How to check seat availability?",
  "How to contact support?",
  "How to cancel a ticket?"
];

export default function SupportButton({ isOpen, setIsOpen }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  function handleOpen() {
    setIsOpen(true);
    if (messages.length === 0) {
      setMessages([
        { role: "system", text: "Welcome to SmartBus Support! How can we help you?" }
      ]);
    }
  }

  async function sendMessage(msg) {
    const userMessage = (typeof msg === "string" ? msg : input).trim();
    if (!userMessage) return;
    setMessages(msgs => [...msgs, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
            { role: "user", parts: [{ text: userMessage }] }
          ]
        })
      });
      const data = await res.json();
      let reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "(No response)";
      reply = reply.replace(/\*/g, "").replace(/\bAI\b/gi, "");
      setMessages(msgs => [...msgs, { role: "bot", text: reply }]);
    } catch (e) {
      setMessages(msgs => [...msgs, { role: "bot", text: "Error contacting Gemini API." }]);
    }
    setLoading(false);
  }

  return (
    <>
      <button
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-blue-600 text-white rounded-full shadow-lg p-4 sm:p-5 z-50 hover:bg-blue-700 transition text-base sm:text-xl font-semibold border-2 border-white/20"
        style={{ minWidth: 60, minHeight: 60 }}
        onClick={handleOpen}
        aria-label="Support"
      >
        💬 Support
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black bg-opacity-40" onClick={() => setIsOpen(false)} />
          <div className="relative h-full w-full max-w-full sm:max-w-sm bg-white shadow-xl flex flex-col" style={{ minHeight: '100vh', maxHeight: '100vh', right: 0 }}>
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 z-10 text-2xl sm:text-lg p-2 sm:p-1 bg-white rounded-full shadow"
              style={{ minWidth: 44, minHeight: 44 }}
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ✖
            </button>
            <h2 className="text-lg sm:text-xl font-bold mb-2 p-4 pb-0">SmartBus Support</h2>
            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {QUICK_REPLIES.map((q, i) => (
                <button
                  key={i}
                  className="bg-blue-100 text-blue-800 px-3 py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-blue-200 transition min-w-[44px] min-h-[36px]"
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto mb-2 border-t rounded-t p-2 sm:p-4 bg-gray-50 text-base sm:text-sm">
              {messages.map((msg, i) => (
                <div key={i} className={`mb-2 ${msg.role === "user" ? "text-right" : "text-left"}`}> 
                  <span className={
                    `px-3 py-2 rounded inline-block ` + 
                    (msg.role === "user"
                      ? "bg-blue-100 text-blue-800"
                      : msg.role === "system"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-800")
                  }>{msg.text}</span>
                </div>
              ))}
              {loading && <div className="text-xs text-gray-400">SmartBus is typing...</div>}
            </div>
            <form className="flex gap-2 p-2 sm:p-4 border-t bg-white" onSubmit={e => { e.preventDefault(); sendMessage(); }}>
              <input
                className="flex-1 border rounded p-3 sm:p-2 text-base sm:text-sm"
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
                style={{ minHeight: 44 }}
              />
              <button className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition text-base sm:text-sm min-h-[44px]" disabled={loading || !input.trim()}>
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 