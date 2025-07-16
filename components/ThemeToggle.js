'use client'

export default function ThemeToggle({ darkMode, toggle }) {
  return (
    <button
      onClick={toggle}
      className="p-2 rounded-full focus:outline-none"
      aria-label="Toggle dark mode"
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  )
}