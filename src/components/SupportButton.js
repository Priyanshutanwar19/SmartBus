import React, { useState } from "react";

// Prefer reading the API key from environment variables; fallback to provided key for now
const FALLBACK_GEMINI_KEY = "AIzaSyAdZ8XgEqiRzXVeN5p5xNM1X-cDke2OSU8";
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || FALLBACK_GEMINI_KEY;
const DEFAULT_GEMINI_MODEL = process.env.REACT_APP_GEMINI_MODEL || "gemini-2.5-flash";
// Explicit API URL (hardcoded) so there's no ambiguity
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

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
  const isConfigured = Boolean(GEMINI_API_KEY);
  const [lastError, setLastError] = useState("");

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
    if (!isConfigured) {
      setMessages(msgs => [...msgs, { role: "bot", text: "Support is not configured yet. Add REACT_APP_GEMINI_API_KEY in your .env and reload." }]);
      return;
    }
    setMessages(msgs => [...msgs, { role: "user", text: userMessage }]);
    setInput("");
    setLoading(true);
    try {
      const attempt = async (signal) => {
        const res = await fetch(GEMINI_API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              { role: "user", parts: [{ text: `${SYSTEM_PROMPT}\n\nUser: ${userMessage}` }] }
            ],
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 256
            },
            safetySettings: [
              { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
              { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
            ]
          }),
          signal
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          const errMsg = data?.error?.message || `Request failed (${res.status})`;
          const err = new Error(errMsg);
          err.status = res.status;
          throw err;
        }
        // If API returns no candidates but prompt feedback exists (blocked content)
        if (!data?.candidates?.length && data?.promptFeedback) {
          const b = data.promptFeedback?.blockReason || "content_blocked";
          const err = new Error(`Response blocked: ${b}`);
          err.status = 400;
          throw err;
        }
        return data;
      };

      // Retry up to 2 times on transient errors (429/5xx) with backoff
      let data;
      for (let i = 0; i < 2; i++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);
        try {
          data = await attempt(controller.signal);
          clearTimeout(timeoutId);
          break;
        } catch (err) {
          clearTimeout(timeoutId);
          const transient = err?.name === "AbortError" || (err?.status && (err.status === 429 || (err.status >= 500 && err.status <= 599)));
          if (i < 1 && transient) {
            await new Promise(r => setTimeout(r, 800 * (i + 1)));
            continue;
          }
          throw err;
        }
      }

      let reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "(No response)";
      reply = reply.replace(/\*/g, "").replace(/\bAI\b/gi, "");
      setMessages(msgs => [...msgs, { role: "bot", text: reply }]);
      setLastError("");
    } catch (e) {
      const friendly = e?.name === "AbortError" ? "Request timed out. Please try again." : (e?.message || "Error contacting support API.");
      setMessages(msgs => [...msgs, { role: "bot", text: friendly }]);
      setLastError(String(e?.message || e));
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
              {!isConfigured && (
                <div className="text-xs text-red-500">Support API not configured. Set REACT_APP_GEMINI_API_KEY in your environment.</div>
              )}
              {loading && <div className="text-xs text-gray-400">SmartBus is typing...</div>}
              {!!lastError && <div className="text-xs text-red-400 mt-2">Error: {lastError}</div>}
            </div>
            <form className="flex gap-2 p-2 sm:p-4 border-t bg-white" onSubmit={e => { e.preventDefault(); sendMessage(); }}>
              <input
                className="flex-1 border rounded p-3 sm:p-2 text-base sm:text-sm"
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={loading || !isConfigured}
                style={{ minHeight: 44 }}
              />
              <button className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition text-base sm:text-sm min-h-[44px]" disabled={loading || !input.trim() || !isConfigured}>
                Send
              </button>
              <button type="button" className="bg-gray-200 text-gray-800 rounded px-3 py-2 font-semibold hover:bg-gray-300 transition text-base sm:text-sm min-h-[44px]" disabled={loading || !isConfigured} onClick={() => sendMessage("Test connection")}>Test</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
} 