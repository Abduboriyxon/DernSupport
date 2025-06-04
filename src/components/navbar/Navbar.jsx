"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Sun, Moon, Menu, X } from "lucide-react"
import { getProfile } from "../../service/profileService"

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [notificationsOpen, setNotificationsOpen] = useState(false)
    const notificationRef = useRef(null)
    const searchRef = useRef(null)
    const [profile, setProfile] = useState(null)

    // Fetch profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const profileData = await getProfile()
                setProfile(profileData)
            } catch (error) {
                console.error("Profile fetch error:", error)
            }
        }
        fetchProfile()
    }, [])

    // Check if dark mode is enabled on mount and set from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme")
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

        if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
            document.documentElement.classList.add("dark")
            setIsDarkMode(true)
        } else {
            document.documentElement.classList.remove("dark")
            setIsDarkMode(false)
        }
    }, [])

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setNotificationsOpen(false)
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Toggle dark/light mode
    const toggleTheme = () => {
        const newDarkMode = !isDarkMode
        setIsDarkMode(newDarkMode)
        localStorage.setItem("theme", newDarkMode ? "dark" : "light")
        if (newDarkMode) {
            document.documentElement.classList.add("dark")
        } else {
            document.documentElement.classList.remove("dark")
        }
    }

    // Helper function to format title based on role
    const getDashboardTitle = () => {
        if (!profile || !profile.user || !profile.user.role) return "Loading..."
        const role = profile.user.role
        const formattedRole = role.charAt(0).toUpperCase() + role.slice(1)
        return `${formattedRole} Dashboard`
    }

    return (
        <motion.nav
            className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg sticky top-0 z-40 transition-all duration-300 border-b border-white/20 dark:border-gray-700/20 ${scrolled ? "shadow-md" : "shadow-sm"
                }`}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            <div className="max-w-[2000px] mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Left section */}
                    <div className="flex items-center space-x-4">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            onClick={toggleSidebar}
                            aria-label="Toggle sidebar"
                        >
                            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </motion.button>

                        <motion.h2
                            className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {getDashboardTitle()}
                        </motion.h2>
                    </div>

                    {/* Right section */}
                    <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
                        {/* Search */}
                        <div className="relative" ref={searchRef}>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                onClick={() => {
                                    setSearchOpen(!searchOpen)
                                    setNotificationsOpen(false)
                                }}
                                aria-label="Search"
                            >
                                <Search size={20} />
                            </motion.button>

                            <AnimatePresence>
                                {searchOpen && (
                                    <motion.div
                                        className="absolute right-0 top-12 w-72 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg p-3 border border-white/20 dark:border-gray-700/20"
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex items-center bg-gray-100/50 dark:bg-gray-700/50 rounded-md px-3 py-2">
                                            <Search size={16} className="text-gray-500 dark:text-gray-400" />
                                            <input
                                                type="text"
                                                placeholder="Search..."
                                                className="ml-2 bg-transparent border-none outline-none w-full text-gray-700 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                                                autoFocus
                                            />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Theme toggle */}
                        <motion.button
                            className="p-2 rounded-full bg-gray-100/50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            onClick={toggleTheme}
                            whileHover={{ scale: 1.05, rotate: 5 }}
                            whileTap={{ scale: 0.95 }}
                            aria-label="Toggle theme"
                        >
                            {isDarkMode ? (
                                <Sun size={20} className="text-amber-400" />
                            ) : (
                                <Moon size={20} className="text-indigo-600" />
                            )}
                        </motion.button>

                        {/* User profile */}
                        <div className="flex items-center space-x-3 pl-2 border-l border-gray-200 dark:border-gray-700">
                            <div className="hidden sm:flex flex-col items-end">
                                <motion.span
                                    className="text-sm font-medium text-gray-700 dark:text-gray-200"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    {profile?.user?.role
                                        ? profile.user.role.charAt(0).toUpperCase() + profile.user.role.slice(1)
                                        : "Loading..."}
                                </motion.span>
                                <motion.span
                                    className="text-xs text-gray-500 dark:text-gray-400"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    {profile?.user?.email || "Loading..."}
                                </motion.span>
                            </div>
                            <motion.div className="relative" whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                                <img
                                    src={
                                        profile?.user?.avatar ||
                                        "https://cdn-icons-png.flaticon.com/128/149/149071.png" ||
                                        "/placeholder.svg"
                                    }
                                    alt="User"
                                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                                />
                                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.nav>
    )
}

export default Navbar
