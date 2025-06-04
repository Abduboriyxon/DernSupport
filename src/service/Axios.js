import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://dern-support-back1.vercel.app/api/v1"

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    withCredentials: true,
    timeout: 30000,
})

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // Add user ID to query params for order endpoints to fix 403 errors
        if (config.url?.includes("/orders/") && !config.url?.includes("/orders/add")) {
            const userInfo = localStorage.getItem("user_info")
            if (userInfo) {
                try {
                    const user = JSON.parse(userInfo)
                    if (user && user._id) {
                        // Add userId as query parameter
                        const separator = config.url.includes("?") ? "&" : "?"
                        config.url = `${config.url}${separator}userId=${user._id}`
                    }
                } catch (error) {
                    console.error("Error parsing user info:", error)
                }
            }
        }

        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

axiosInstance.interceptors.response.use(
    (response) => {
        if (response.config.url?.includes("/login") && response.data.token) {
            localStorage.setItem("auth_token", response.data.token)

            // Store user info for order authorization
            if (response.data.user) {
                localStorage.setItem("user_info", JSON.stringify(response.data.user))
            }
        }
        return response
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("auth_token")
            localStorage.removeItem("user_info")
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login"
            }
        }

        if (!error.response) {
            return Promise.reject(new Error("Server bilan aloqa o'rnatib bo'lmadi. Keyinroq urinib ko'ring."))
        }

        return Promise.reject(error)
    },
)

export default axiosInstance
