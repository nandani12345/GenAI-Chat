export default function Header({ darkMode, setDarkMode }) {
  return (
    <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-3xl mx-auto p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          LLM Persona Chat
        </h1>
       
      </div>
    </header>
  );
}
