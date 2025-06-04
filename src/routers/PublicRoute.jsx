"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const PublicRoute = ({ children }) => {
    const { loading, authenticated, user } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (authenticated) {
        // Role ga qarab yo'naltirish
        if (user?.role === "admin") {
            return <Navigate to="/dashboard/admin" replace />
        } else if (user?.role === "master") {
            return <Navigate to="/dashboard/master" replace />
        } else if (user?.role === "user") {
            return <Navigate to="/dashboard/user" replace />
        } else {
            return <Navigate to="/unauthorized" replace />
        }
    }

    return children
}

export default PublicRoute
