import MessageBubble from "./MessageBubble.jsx";

export default function ChatWindow({ messages, darkMode }) {
  return (
    <div className="flex flex-col gap-2">
      {messages.map((msg, idx) => (
        <MessageBubble
          key={idx}
          role={msg.role}
          text={msg.isSending ? "Typing..." : msg.text}
          timestamp={msg.timestamp}
          darkMode={darkMode}
        />
      ))}
    </div>
  );
}
