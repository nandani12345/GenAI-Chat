import { useState, useEffect, useRef } from "react";
import Header from "./components/Header.jsx";
import PersonaToggle from "./components/personaToggle.jsx";
import ChatWindow from "./components/ChatWindow.jsx";
import { sendChat } from "../lib/api.js";

export default function App() {
  const [persona, setPersona] = useState("hitesh");

  // Load messages from localStorage if available
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem("chatMessages");
    return saved ? JSON.parse(saved) : { hitesh: [], piyush: [] };
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Load dark mode preference
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const chatRef = useRef(null);

  // Persist dark mode and toggle class
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Persist messages
  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, persona]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    setLoading(true);

    // Add timestamp for user message
    const userMsg = { role: "user", text: input, timestamp: new Date().toISOString() };
    setMessages((prev) => ({
      ...prev,
      [persona]: [...prev[persona], userMsg],
    }));
    setInput("");

    // Add a temporary "typing..." bubble for bot/persona
    const sendingMsg = { role: persona, text: "", isSending: true, timestamp: new Date().toISOString() };
    setMessages((prev) => ({
      ...prev,
      [persona]: [...prev[persona], sendingMsg],
    }));

    try {
      const res = await sendChat(persona, input);

      // Replace "typing..." bubble with actual bot message
      const botMsg = { role: persona, text: res.reply, timestamp: new Date().toISOString() };
      setMessages((prev) => {
        const newMsgs = [...prev[persona]];
        newMsgs[newMsgs.length - 1] = botMsg;
        return { ...prev, [persona]: newMsgs };
      });
    } catch (err) {
      setMessages((prev) => {
        const newMsgs = [...prev[persona]];
        newMsgs[newMsgs.length - 1] = { role: persona, text: "Error connecting to backend", timestamp: new Date().toISOString() };
        return { ...prev, [persona]: newMsgs };
      });
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className="max-w-3xl mx-auto p-4 flex flex-col gap-3">
        <PersonaToggle persona={persona} setPersona={setPersona} />

        {/* Chat window with scroll */}
        <div
          ref={chatRef}
          className="h-[600px] w-full overflow-y-auto border rounded p-3 bg-white dark:bg-gray-800"
        >
          <ChatWindow
            messages={messages[persona].map(msg => ({
              ...msg,
              timestamp: msg.timestamp || new Date().toISOString()
            }))}
            darkMode={darkMode}
          />
        </div>

        {/* Input & Send button */}
        <div className="flex">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 border rounded-l px-3 py-2 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-r disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
