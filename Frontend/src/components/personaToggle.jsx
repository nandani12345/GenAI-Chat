export default function PersonaToggle({ persona, setPersona }) {
  return (
    <div className="flex gap-2">
      {["hitesh", "piyush"].map((p) => (
        <button
          key={p}
          onClick={() => setPersona(p)}
          className={`px-3 py-1 rounded ${
            persona === p ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700 dark:text-gray-100"
          }`}
        >
          {p.charAt(0).toUpperCase() + p.slice(1)}
        </button>
      ))}
    </div>
  );
}
