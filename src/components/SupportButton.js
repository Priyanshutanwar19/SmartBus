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
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full shadow-lg p-4 z-50 hover:bg-blue-700 transition"
        onClick={handleOpen}
        aria-label="Support"
      >
        💬 Support
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black bg-opacity-40" onClick={() => setIsOpen(false)} />
          <div className="relative h-full w-full max-w-sm md:max-w-sm bg-white shadow-xl flex flex-col" style={{ minHeight: '100vh', maxHeight: '100vh', right: 0 }}>
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
              onClick={() => setIsOpen(false)}
              aria-label="Close"
            >
              ✖
            </button>
            <h2 className="text-lg font-bold mb-2 p-4 pb-0">SmartBus Support</h2>
            <div className="flex flex-wrap gap-2 px-4 pb-2">
              {QUICK_REPLIES.map((q, i) => (
                <button
                  key={i}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-200 transition"
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                >
                  {q}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-y-auto mb-2 border-t rounded-t p-4 bg-gray-50">
              {messages.map((msg, i) => (
                <div key={i} className={`mb-2 text-sm ${msg.role === "user" ? "text-right" : "text-left"}`}>
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
            <form className="flex gap-2 p-4 border-t bg-white" onSubmit={e => { e.preventDefault(); sendMessage(); }}>
              <input
                className="flex-1 border rounded p-2"
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading}
              />
              <button className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition" disabled={loading || !input.trim()}>
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 