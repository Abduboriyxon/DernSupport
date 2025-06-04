"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
    Package,
    Calendar,
    DollarSign,
    MapPin,
    User,
    Eye,
    Edit,
    X,
    RefreshCw,
    AlertCircle,
    CheckCircle,
    Clock,
    XCircle,
} from "lucide-react"
import { getUserOrders, cancelUserOrder } from "../../../service/userOrderService"

const UserOrdersList = () => {
    const navigate = useNavigate()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [cancellingOrder, setCancellingOrder] = useState(null)

    const fetchOrders = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await getUserOrders()
            setOrders(response.data || [])
        } catch (err) {
            console.error("Buyurtmalarni yuklashda xato:", err)
            setError(err.response?.data?.message || "Buyurtmalarni yuklashda xato yuz berdi")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchOrders()
    }, [])

    const handleCancelOrder = async (orderId) => {
        setCancellingOrder(orderId)
        try {
            await cancelUserOrder(orderId)
            await fetchOrders() // Refresh the list
        } catch (err) {
            console.error("Buyurtmani bekor qilishda xato:", err)
            setError(err.response?.data?.message || "Buyurtmani bekor qilishda xato yuz berdi")
        } finally {
            setCancellingOrder(null)
        }
    }

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
            case "tasdiqlangan":
            case "in_progress":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
            case "completed":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
            case "cancelled":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
        }
    }

    const getStatusText = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "Kutilmoqda"
            case "tasdiqlangan":
                return "Tasdiqlangan"
            case "in_progress":
                return "Jarayonda"
            case "completed":
                return "Yakunlangan"
            case "cancelled":
                return "Bekor qilingan"
            default:
                return status || "Noma'lum"
        }
    }

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return <Clock size={16} />
            case "tasdiqlangan":
            case "in_progress":
                return <RefreshCw size={16} />
            case "completed":
                return <CheckCircle size={16} />
            case "cancelled":
                return <XCircle size={16} />
            default:
                return <AlertCircle size={16} />
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return "Belgilanmagan"
        return new Date(dateString).toLocaleDateString("uz-UZ", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 flex items-center justify-center">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="relative mb-4">
                        <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-pulse"></div>
                        <RefreshCw className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Buyurtmalar yuklanmoqda...</p>
                </motion.div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 flex items-center justify-center">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-lg w-full">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20 text-center">
                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-red-100 dark:bg-red-900/30">
                            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Xatolik yuz berdi</h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">{error}</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg mx-auto"
                            onClick={fetchOrders}
                        >
                            <RefreshCw size={16} />
                            Qayta urinish
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Mening Buyurtmalarim</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">Jami {orders.length} ta buyurtma</p>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                            onClick={() => navigate("/orders/add")}
                        >
                            <Package size={20} />
                            Yangi buyurtma
                        </motion.button>
                    </div>
                </motion.div>

                {/* Orders Grid */}
                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-16"
                    >
                        <Package className="w-24 h-24 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Hozircha buyurtmalar yo'q</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">Birinchi buyurtmangizni yarating</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg mx-auto"
                            onClick={() => navigate("/orders/add")}
                        >
                            <Package size={20} />
                            Buyurtma yaratish
                        </motion.button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {orders.map((order, index) => (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20 hover:shadow-2xl transition-all duration-300"
                                >
                                    {/* Order Header */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                            <span className="font-semibold text-gray-900 dark:text-gray-100">#{order.orderNumber}</span>
                                        </div>
                                        <span
                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                order.status,
                                            )}`}
                                        >
                                            {getStatusIcon(order.status)}
                                            {getStatusText(order.status)}
                                        </span>
                                    </div>

                                    {/* Order Info */}
                                    <div className="space-y-3 mb-6">
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{order.productName}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{order.category}</p>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <DollarSign size={16} className="text-green-600" />
                                            <span className="font-medium">
                                                {order.price ? `${order.price.toLocaleString()} UZS` : "Narx belgilanmagan"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Calendar size={16} className="text-blue-600" />
                                            <span>{formatDate(order.appointmentDate)}</span>
                                        </div>

                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <MapPin size={16} className="text-red-600" />
                                            <span className="truncate">{order.address}</span>
                                        </div>

                                        {order.assignedMaster && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <User size={16} className="text-purple-600" />
                                                <span>Master: {order.assignedMaster}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all duration-200"
                                            onClick={() => navigate(`/user-orders/${order._id}`)}
                                        >
                                            <Eye size={16} />
                                            Ko'rish
                                        </motion.button>

                                        {order.status === "pending" && (
                                            <>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-all duration-200"
                                                    onClick={() => navigate(`/user-orders/${order._id}/edit`)}
                                                >
                                                    <Edit size={16} />
                                                    Tahrirlash
                                                </motion.button>

                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    onClick={() => handleCancelOrder(order._id)}
                                                    disabled={cancellingOrder === order._id}
                                                >
                                                    {cancellingOrder === order._id ? (
                                                        <RefreshCw size={16} className="animate-spin" />
                                                    ) : (
                                                        <X size={16} />
                                                    )}
                                                    Bekor qilish
                                                </motion.button>
                                            </>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserOrdersList
