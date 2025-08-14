export default function MessageBubble({ role, text, darkMode, timestamp, isSending }) {
  const isUser = role === "user";

  // Set bubble colors based on role
  let personaColor = "bg-gray-300 text-black"; // default for unknown roles

  if (role === "hitesh") personaColor = "bg-black text-white"; // hitesh bubble
  else if (role === "piyush") personaColor = "bg-black text-white"; // piyush bubble

  // Format timestamp
  const formattedTime = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";

  const formattedDate = timestamp
    ? new Date(timestamp).toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" })
    : "";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      {!isUser && (
        <div className="mr-2 flex items-center">
          <div className="w-6 h-6 rounded-full bg-gray-400 text-xs flex items-center justify-center text-white">
            {role[0].toUpperCase()}
          </div>
        </div>
      )}
      <div
        className={`p-2 rounded-lg max-w-[70%] break-words ${isUser
            ? "bg-blue-600 text-white"
            : `${personaColor} ${darkMode ? "dark:bg-opacity-80 dark:text-gray-100" : ""}`
          }`}
      >
        {!isUser && <div className="text-sm font-semibold mb-1">{role.toUpperCase()}</div>}
        <div>{isSending ? "typing..." : text}</div>
        {!isSending && (
          <div className="text-xs text-gray-500 dark:text-gray-300 mt-1 text-right">
            {formattedTime} {formattedDate}
          </div>
        )}
      </div>
    </div>
  );
}
