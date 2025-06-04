"use client"

import { useEffect, useState, useCallback } from "react"
import axiosInstance from "../service/Axios"

export const useAuth = () => {
    const [auth, setAuth] = useState({
        loading: true,
        authenticated: false,
        user: null,
    })

    const checkAuth = useCallback(async () => {
        try {
            const token = localStorage.getItem("auth_token")

            if (!token) {
                setAuth({
                    loading: false,
                    authenticated: false,
                    user: null,
                })
                return
            }

            const res = await axiosInstance.get("/check-auth")

            if (res.data.authenticated && res.data.user) {
                // Store user info in localStorage for order authorization
                localStorage.setItem("user_info", JSON.stringify(res.data.user))

                setAuth({
                    loading: false,
                    authenticated: true,
                    user: res.data.user,
                })
            } else {
                setAuth({
                    loading: false,
                    authenticated: false,
                    user: null,
                })
                localStorage.removeItem("auth_token")
                localStorage.removeItem("user_info")
            }
        } catch (err) {
            setAuth({
                loading: false,
                authenticated: false,
                user: null,
            })
            localStorage.removeItem("auth_token")
            localStorage.removeItem("user_info")
        }
    }, [])

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    return { ...auth, refetch: checkAuth }
}
