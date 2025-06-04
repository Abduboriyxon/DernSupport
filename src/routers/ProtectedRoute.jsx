"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { loading, authenticated, user } = useAuth()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    if (!authenticated) {
        return <Navigate to="/login" replace />
    }

    if (!allowedRoles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />
    }

    return children
}

export default ProtectedRoute
