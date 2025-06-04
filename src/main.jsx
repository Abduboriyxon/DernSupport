import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"

// Initialize dark mode on page load
const initializeDarkMode = () => {
  // Check localStorage first
  const savedTheme = localStorage.getItem("theme")

  // Check system preference if no saved theme
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

  // Apply dark mode if needed
  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
}

// Run initialization
initializeDarkMode()

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
