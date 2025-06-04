import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaExclamationCircle } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../service/Axios";

function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        userType: "jismoniy",
        name: "",
        login: "",
        companyName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        document.title = "Dern-Support | Ro'yxatdan o'tish";
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
        if (error) setError("");
    };

    const togglePassword = () => setShowPassword(!showPassword);
    const toggleConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Validate password match
        if (form.password !== form.confirmPassword) {
            setError("Parollar mos kelmadi!");
            setIsLoading(false);
            return;
        }

        // Validate password length
        if (form.password.length < 8) {
            setError("Parol kamida 8 ta belgidan iborat bo'lishi shart!");
            setIsLoading(false);
            return;
        }

        // Validate phone format
        if (!/^\+998\d{9}$/.test(form.phone)) {
            setError("Telefon raqami +998XXXXXXXXX formatida bo'lishi kerak");
            setIsLoading(false);
            return;
        }

        // Validate email format
        if (!/^\S+@\S+\.\S+$/.test(form.email)) {
            setError("Elektron pochta formati noto'g'ri");
            setIsLoading(false);
            return;
        }

        // Validate companyName for yuridik users
        if (form.userType === "yuridik" && !form.companyName) {
            setError("Biznes hisoblari uchun kompaniya nomi talab qilinadi");
            setIsLoading(false);
            return;
        }

        try {
            const payload = {
                userType: form.userType,
                name: form.name,
                login: form.login,
                companyName: form.userType === "yuridik" ? form.companyName : form.companyName || undefined,
                email: form.email,
                phone: form.phone,
                password: form.password,
            };

            const response = await axiosInstance.post("/user/register", payload);

            if (response.data.status === "success") {
                navigate("/login");
            }
        } catch (err) {
            const message = err.response?.data?.message || "Ro‘yxatdan o‘tish amalga oshmadi!";
            setError(
                message.includes("CSRF")
                    ? "Xavfsizlik belgisi xatosi. Iltimos, sahifani yangilang."
                    : message
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-4">
            <motion.div
                className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-6 sm:p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 text-center">
                    Dern-Support
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-1 mb-6">
                    Hisob yaratish
                </p>

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
                        <select
                            name="userType"
                            id="userType"
                            value={form.userType}
                            onChange={handleChange}
                            className="peer w-full px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200"
                            required
                            aria-describedby="userType-label"
                        >
                            <option className="text-black" value="jismoniy">Individual (Jismoniy)</option>
                            <option className="text-black" value="yuridik">Business (Yuridik)</option>
                        </select>
                        <label
                            htmlFor="userType"
                            className="absolute left-4 -top-2.5 text-xs text-gray-500 dark:text-gray-400 transition-all peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-blue-500 dark:peer-focus:text-blue-400"
                            id="userType-label"
                        >
                            Hisob turini tanglang
                        </label>
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            value={form.name}
                            onChange={handleChange}
                            className="peer w-full px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200 "
                            placeholder="To'liq ismingiz"
                            required
                            aria-describedby="name-label"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            name="login"
                            id="login"
                            value={form.login}
                            onChange={handleChange}
                            className="peer w-full px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200 "
                            placeholder="Foydalanuvchi nomi"
                            required
                            aria-describedby="login-label"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type="text"
                            name="companyName"
                            id="companyName"
                            value={form.companyName}
                            onChange={handleChange}
                            className="peer w-full px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200 "
                            placeholder={form.userType === "jismoniy" ? "Kompaniya nomi (ixtiyoriy)" : "Kompaniya nomi"}
                            required={form.userType === "yuridik"}
                            aria-describedby="companyName-label"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            value={form.email}
                            onChange={handleChange}
                            className="peer w-full px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200 "
                            placeholder="E-pochta manzili"
                            required
                            aria-describedby="email-label"
                        />

                    </div>

                    <div className="relative">
                        <input
                            type="tel"
                            name="phone"
                            id="phone"
                            value={form.phone}
                            onChange={handleChange}
                            className="peer w-full px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200 "
                            placeholder="Telefon Raqam"
                            required
                            aria-describedby="phone-label"
                        />
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            id="password"
                            value={form.password}
                            onChange={handleChange}
                            className="peer w-full px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200 "
                            placeholder="Parol"
                            required
                            minLength={8}
                            aria-describedby="password-label"
                        />

                        <button
                            type="button"
                            onClick={togglePassword}
                            className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>

                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            id="confirmPassword"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="peer w-full px-4 py-2 bg-transparent border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-800 dark:text-gray-200 "
                            placeholder="Parolni qaytaring"
                            required
                            aria-describedby="confirmPassword-label"
                        />
                        <button
                            type="button"
                            onClick={toggleConfirmPassword}
                            className="absolute right-3 top-2.5 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                            {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>

                    <motion.button
                        type="submit"
                        // className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-md font-medium text-sm hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                        className="w-full py-2.5 btn-primary rounded-md"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isLoading}
                        aria-label="Sign up"
                    >
                        {isLoading ? (
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8z"
                                />
                            </svg>
                        ) : (
                            "Ro'yxatdan o'tish"
                        )}
                    </motion.button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    Hisobingiz bormi?{" "}
                    <Link
                        to="/login"
                        className="text-blue-500 dark:text-blue-400 hover:underline"
                        aria-label="Go to login page"
                    >
                        Kirish
                    </Link>
                </p>
            </motion.div>
        </div>
    );
}

export default Register;