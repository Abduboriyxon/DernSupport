/**
 * Combines multiple class names into a single string
 * @param {string[]} classes - Class names to combine
 * @returns {string} - Combined class names
 */
export function cn(...classes) {
    return classes.filter(Boolean).join(" ")
}

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout)
            func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

/**
 * Saves the theme preference to localStorage
 * @param {string} theme - 'dark' or 'light'
 */
export function setThemePreference(theme) {
    localStorage.setItem("theme", theme)

    if (theme === "dark") {
        document.documentElement.classList.add("dark")
    } else {
        document.documentElement.classList.remove("dark")
    }
}

/**
 * Gets the current theme preference
 * @returns {string} - 'dark' or 'light'
 */
export function getThemePreference() {
    // Check localStorage first
    const savedTheme = localStorage.getItem("theme")

    // Check system preference if no saved theme
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    // Return the theme
    if (savedTheme) {
        return savedTheme
    }

    return prefersDark ? "dark" : "light"
}
