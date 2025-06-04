"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Sidebar from "../sidebar/Sidebar"
import Navbar from "../navbar/Navbar"
import { Outlet } from "react-router-dom"

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isMobile, setIsMobile] = useState(false)

    // Handle responsive behavior
    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth < 768
            setIsMobile(mobile)
            setIsSidebarOpen(!mobile)
        }

        checkScreenSize()
        window.addEventListener("resize", checkScreenSize)
        return () => window.removeEventListener("resize", checkScreenSize)
    }, [])

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Sidebar */}
            <AnimatePresence>
                {(isSidebarOpen || !isMobile) && (
                    <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{
                            width: isMobile ? "100%" : isSidebarOpen ? 280 : 80,
                            opacity: 1,
                        }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className={`${isMobile ? "fixed inset-0 z-50" : "fixed top-0 left-0 h-screen z-40"}`}
                    >
                        <div className={`${isMobile ? "w-[280px]" : "w-full"} h-full`}>
                            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
                        </div>
                        {isMobile && (
                            <motion.div
                                className="absolute inset-0 bg-black/50 -z-10"
                                onClick={toggleSidebar}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            />
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className={`flex-1 flex flex-col ${!isMobile && isSidebarOpen ? "ml-[288px]" : !isMobile ? "ml-20" : ""}`}>
                <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
                    <div className="max-w-[2000px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Layout
