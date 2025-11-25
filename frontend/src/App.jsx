// src/App.jsx
import { useState, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import ContactForm from "./components/ContactForm";
import ContactList from "./components/ContactList";

function App() {
  const [contacts, setContacts] = useState([]);
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("theme") ||
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="p-4 md:p-8 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] md:text-[32px] font-bold text-[#00277a]">Contact Management</h1>

          <button
            onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
            className="p-2 rounded-md border bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            aria-label="Toggle theme"
            title="Toggle theme"
          >
            {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>
        </div>

        <ContactForm setContacts={setContacts} contacts={contacts} theme={theme} />
      </div>

      <div className="lg:col-span-2">
        <ContactList setContacts={setContacts} contacts={contacts} theme={theme} />
      </div>
    </div>
  )
}

export default App;
