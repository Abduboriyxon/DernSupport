"use client"

import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { FaEye, FaEyeSlash, FaExclamationCircle } from "react-icons/fa"
import { motion, AnimatePresence } from "framer-motion"
import axiosInstance from "../../service/Axios"

function Login() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        login: "",
        password: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        document.title = "Dern-Support | Login"
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm({ ...form, [name]: value })
        if (error) setError("")
    }

    const togglePassword = () => setShowPassword(!showPassword)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
            const response = await axiosInstance.post("/login", {
                login: form.login.trim(),
                password: form.password,
            })

            if (response.data.status === "success") {
                const userRole = response.data.user.role

                // Navigate based on user role
                switch (userRole) {
                    case "admin":
                        navigate("/dashboard/admin", { replace: true })
                        break
                    case "master":
                        navigate("/dashboard/master", { replace: true })
                        break
                    case "user":
                        navigate("/dashboard/user", { replace: true })
                        break
                    default:
                        setError("Noma'lum foydalanuvchi turi")
                }

                // Force page reload to update auth state
                setTimeout(() => {
                    window.location.reload()
                }, 100)
            } else {
                setError(response.data.message || "Login muvaffaqiyatsiz")
            }
        } catch (err) {
            let errorMessage = "Login muvaffaqiyatsiz"

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message
            } else if (err.message) {
                errorMessage = err.message
            }

            setError(errorMessage)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-4">
            <motion.div
                className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center">Dern-Support</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1 mb-6">Hisobingizga kiring</p>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-md flex items-center space-x-2 text-red-700 dark:text-red-300"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            role="alert"
                            aria-live="assertive"
                        >
                            <FaExclamationCircle size={16} />
                            <span className="text-sm">{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} autoComplete="off" className="space-y-6">
                    <div className="relative">
                        <input
                            type="text"
                            name="login"
                            id="login"
                            value={form.login}
                            onChange={handleChange}
                            className="peer w-full px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200"
                            placeholder="Login"
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            value={form.password}
                            onChange={handleChange}
                            className="peer w-full px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200"
                            placeholder="Password"
                            required
                            minLength={3}
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            onClick={togglePassword}
                            className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 disabled:opacity-50"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            disabled={isLoading}
                        >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>

                    <motion.button
                        type="submit"
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={!isLoading ? { scale: 1.02 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                        disabled={isLoading}
                        aria-label="Sign in"
                    >
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <svg
                                    className="animate-spin h-5 w-5 text-white mr-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Kuting...
                            </div>
                        ) : (
                            "Kirish"
                        )}
                    </motion.button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Hisobingiz yo'qmi?{" "}
                    <Link
                        to="/register"
                        className="text-blue-500 dark:text-blue-400 hover:underline"
                        aria-label="Go to registration page"
                    >
                        Ro'yxatdan o'tish
                    </Link>
                </p>
            </motion.div>
        </div>
    )
}

export default Login
