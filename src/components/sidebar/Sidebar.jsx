"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    ShoppingCart,
    BarChart2,
    Users,
    LogOut,
    Home,
    PenToolIcon as Tool,
    Settings,
    Package,
    ShoppingBag,
} from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import axiosInstance from "../../service/Axios"
import { getProfile } from "../../service/profileService"
import { useAuth } from "../../hooks/useAuth"

const Sidebar = ({ isOpen, toggleSidebar, isMobile }) => {
    const { user } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const [profile, setProfile] = useState(null)
    const [userRole, setUserRole] = useState(user?.role || null)
    const [todayOrdersCount, setTodayOrdersCount] = useState(0)

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

    // Fetch today's orders
    useEffect(() => {
        const fetchTodayOrders = async () => {
            try {
                const response = await axiosInstance.get("/orders")
                const orders = Array.isArray(response.data) ? response.data : []

                // Filter orders for today
                const today = new Date(new Date().toISOString().split("T")[0])
                const todayOrders = orders.filter((order) => {
                    const createdAt = new Date(order.createdAt)
                    return (
                        createdAt.getFullYear() === today.getFullYear() &&
                        createdAt.getMonth() === today.getMonth() &&
                        createdAt.getDate() === today.getDate()
                    )
                })

                setTodayOrdersCount(todayOrders.length)
            } catch (error) {
                setTodayOrdersCount(0)
            }
        }
        fetchTodayOrders()
    }, [])

    useEffect(() => {
        setUserRole(user?.role || null)
    }, [user])

    const handleLogout = async () => {
        try {
            await axiosInstance.post("/logout")
            localStorage.removeItem("auth_token")
            navigate("/")
            window.location.reload()
        } catch (error) {
            localStorage.removeItem("auth_token")
            navigate("/")
            window.location.reload()
        }
    }

    // Define navigation items based on user role
    const getNavItems = () => {
        const commonItems = [{ name: "Chiqish", icon: LogOut, action: handleLogout }]

        switch (userRole) {
            case "admin":
                return [
                    { name: "Dashboard", icon: Home, path: "/dashboard/admin" },
                    { name: "Buyurtmalar", icon: ShoppingCart, path: "/buyurtma/admin" },
                    { name: "Ko'rsatgichlar (KPI)", icon: BarChart2, path: "/kpi/admin" },
                    { name: "Foydalanuvchilar", icon: Users, path: "/users/admin" },
                    { name: "Master", icon: Tool, path: "/master/admin" },
                    ...commonItems,
                ]
            case "master":
                return [
                    { name: "Dashboard", icon: Home, path: "/dashboard/master" },
                    { name: "Buyurtmalar", icon: ShoppingCart, path: "/buyurtma/master" },
                    { name: "Ko'rsatgichlar (KPI)", icon: BarChart2, path: "/kpi/master" },
                    { name: "Extiyot qismlar", icon: Settings, path: "/parts/master" },
                    ...commonItems,
                ]
            case "user":
                return [
                    { name: "Dashboard", icon: Home, path: "/dashboard/user" },
                    { name: "Buyurtmalarim", icon: ShoppingBag, path: "/buyurtma/user" },
                    ...commonItems,
                ]
            default:
                return [{ name: "Dashboard", icon: Home, path: "/dashboard" }, ...commonItems]
        }
    }

    const navItems = getNavItems()

    // Get the appropriate dashboard stats based on user role
    const getDashboardStats = () => {
        switch (userRole) {
            case "admin":
                return {
                    label: "Bugungi buyurtmalar",
                    value: todayOrdersCount.toString(),
                    icon: Package,
                }
            case "master":
                return {
                    label: "Bugungi buyurtmalar",
                    value: todayOrdersCount.toString(),
                    icon: Tool,
                }
            case "user":
                return {
                    label: "Bugungi buyurtmalarim",
                    value: todayOrdersCount.toString(),
                    icon: ShoppingBag,
                }
            default:
                return {
                    label: "Bugungi buyurtmalar",
                    value: "0",
                    icon: Package,
                }
        }
    }

    const dashboardStats = getDashboardStats()

    return (
        <motion.div
            className={`h-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-r border-white/20 dark:border-gray-700/20 flex flex-col transition-all duration-300 ${isMobile ? "w-full" : isOpen ? "w-72" : "w-20"
                }`}
            initial={false}
            animate={{ width: isMobile ? "100%" : isOpen ? 288 : 80 }}
            transition={{ duration: 0.3 }}
        >
            {/* Gradient Top Bar */}
            <div className="h-2 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700"></div>

            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <NavLink to={`/profile`} className="flex items-center space-x-3">
                    <motion.div className="relative" animate={{ scale: isOpen ? 1 : 0.85 }} transition={{ duration: 0.3 }}>
                        <img
                            src={
                                profile?.user?.avatar || "https://cdn-icons-png.flaticon.com/128/149/149071.png" || "/placeholder.svg"
                            }
                            alt=""
                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                        />
                        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
                    </motion.div>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                className="flex flex-col"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                <span className="font-semibold text-gray-800 dark:text-gray-100">
                                    {profile?.user?.role
                                        ? profile.user.role.charAt(0).toUpperCase() + profile.user.role.slice(1)
                                        : "Loading..."}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">{profile?.user?.email || "Loading..."}</span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </NavLink>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-4 overflow-y-auto">
                <ul className="px-3 space-y-2">
                    {navItems.map((item, index) => {
                        const isActive = location.pathname === item.path

                        return (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                {item.action ? (
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={item.action}
                                        className={`w-full flex items-center ${isOpen ? "justify-start" : "justify-center"
                                            } p-3 rounded-lg text-gray-700 dark:text-gray-200 transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700`}
                                    >
                                        <item.icon size={22} className="text-gray-500 dark:text-gray-400" />
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.span
                                                    className="ml-3 truncate"
                                                    initial={{ opacity: 0, width: 0 }}
                                                    animate={{ opacity: 1, width: "auto" }}
                                                    exit={{ opacity: 0, width: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {item.name}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>
                                ) : (
                                    <NavLink
                                        to={item.path}
                                        className={`flex items-center ${isOpen ? "justify-start" : "justify-center"
                                            } p-3 rounded-lg text-gray-700 dark:text-gray-200 transition-all duration-200 ${isActive
                                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                                : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`}
                                    >
                                        <item.icon size={22} className={isActive ? "text-white" : "text-gray-500 dark:text-gray-400"} />
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.span
                                                    className="ml-3 truncate"
                                                    initial={{ opacity: 0, width: 0 }}
                                                    animate={{ opacity: 1, width: "auto" }}
                                                    exit={{ opacity: 0, width: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {item.name}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </NavLink>
                                )}
                            </motion.li>
                        )
                    })}
                </ul>
            </div>

            {/* Footer */}
            {isOpen && (
                <motion.div
                    className="p-4 border-t border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-3 border border-white/20 dark:border-gray-700/20">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-white dark:bg-gray-600 rounded-md">
                                <dashboardStats.icon size={18} className="text-gray-600 dark:text-gray-300" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{dashboardStats.label}</p>
                                <p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    {dashboardStats.value}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </motion.div>
    )
}

export default Sidebar
