import './App.css'      
// ------------------ IMPORTANT: initial theme MUST run before React mounts ------------------
(function applyInitialTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      document.documentElement.classList.add("dark");
    } else if (saved === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // No saved preference -> follow system
      if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      }
    }
  } catch (e) {
    // ignore (e.g., restricted environment)
  }
})();
// ------------------------------------------------------------------------------------------

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// ensure this import points to your Tailwind build file
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
