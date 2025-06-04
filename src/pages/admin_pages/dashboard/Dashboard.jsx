import { motion } from "framer-motion"

const Dashboard = () => {
    return (
        <motion.div
            className="p-4 sm:p-6 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Welcome Header */}
            <div className="mb-8">
                <motion.h1
                    className="text-xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Administrator boshqaruv paneliga xush kelibsiz
                </motion.h1>
            </div>
        </motion.div>
    )
}

export default Dashboard
