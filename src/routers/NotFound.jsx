"use client"

import { motion } from "framer-motion"
import { Home, ArrowLeft, Search, HelpCircle } from "lucide-react"
import { Link } from "react-router-dom"

const NotFound = () => {
    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.3,
                staggerChildren: 0.2,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: "easeOut" },
        },
    }

    // SVG animation variants
    const pathVariants = {
        hidden: { pathLength: 0, opacity: 0 },
        visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 2, ease: "easeInOut" },
        },
    }

    const floatVariants = {
        initial: { y: 0 },
        animate: {
            y: [0, -10, 0],
            transition: {
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: "reverse",
                ease: "easeInOut",
            },
        },
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-50 dark:bg-gray-900">
            <motion.div
                className="max-w-3xl w-full text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* 404 Illustration */}
                <motion.div className="mb-8 relative mx-auto" variants={floatVariants} initial="initial" animate="animate">
                    <svg
                        width="200"
                        height="200"
                        viewBox="0 0 200 200"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mx-auto"
                    >
                        <motion.circle
                            cx="100"
                            cy="100"
                            r="80"
                            stroke="currentColor"
                            strokeWidth="2"
                            className="text-blue-500 dark:text-blue-400"
                            variants={pathVariants}
                            initial="hidden"
                            animate="visible"
                        />
                        <motion.path
                            d="M65 80V120M65 80H85M65 100H85M65 120H85M85 80V120M115 80L135 120M135 80L115 120"
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-800 dark:text-gray-200"
                            variants={pathVariants}
                            initial="hidden"
                            animate="visible"
                        />
                    </svg>

                    {/* Decorative elements */}
                    <motion.div
                        className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-amber-400 dark:bg-amber-500 opacity-70"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, duration: 0.5, type: "spring" }}
                    />
                    <motion.div
                        className="absolute -bottom-2 -left-6 w-8 h-8 rounded-full bg-green-400 dark:bg-green-500 opacity-70"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.7, duration: 0.5, type: "spring" }}
                    />
                    <motion.div
                        className="absolute top-1/2 -translate-y-1/2 -left-10 w-6 h-6 rounded-full bg-purple-400 dark:bg-purple-500 opacity-70"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.9, duration: 0.5, type: "spring" }}
                    />
                </motion.div>

                {/* Text Content */}
                <motion.h1
                    className="text-6xl sm:text-7xl md:text-8xl font-bold text-gray-800 dark:text-white mb-4"
                    variants={itemVariants}
                >
                    404
                </motion.h1>
                <motion.h2
                    className="text-2xl sm:text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-4"
                    variants={itemVariants}
                >
                    Sahifa topilmadi
                </motion.h2>
                <motion.p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-lg mx-auto" variants={itemVariants}>
                    Siz qidirayotgan sahifa mavjud emas yoki o'chirilgan. Iltimos, boshqa sahifaga o'ting.
                </motion.p>

                {/* Action Buttons */}
                <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={itemVariants}>
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                    >
                        <Home size={18} />
                        <span>Bosh sahifaga</span>
                    </Link>
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors shadow-sm"
                    >
                        <ArrowLeft size={18} />
                        <span>Orqaga qaytish</span>
                    </Link>
                </motion.div>

                {/* Additional Help */}
                <motion.div
                    className="mt-12 flex flex-col sm:flex-row gap-6 justify-center text-gray-600 dark:text-gray-400"
                    variants={itemVariants}
                >
                    <a
                        href="#"
                        className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <Search size={18} />
                        <span>Qidirish</span>
                    </a>
                    <a
                        href="#"
                        className="flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                        <HelpCircle size={18} />
                        <span>Yordam markazi</span>
                    </a>
                </motion.div>
            </motion.div>
        </div>
    )
}

export default NotFound
