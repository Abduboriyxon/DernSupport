"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Package,
    User,
    DollarSign,
    Clock,
    RefreshCw,
    Edit,
    AlertCircle,
    CheckCircle,
    XCircle,
    Phone,
    Mail,
} from "lucide-react"
import { getUserOrderById } from "../../../service/userOrderService"

const UserOrderDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchOrder = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await getUserOrderById(id)
            setOrder(response.data)
        } catch (err) {
            console.error("Buyurtmani yuklashda xato:", err)
            setError(err.response?.data?.message || "Buyurtmani yuklashda xato yuz berdi")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (id) {
            fetchOrder()
        }
    }, [id])

    const formatDate = (dateString) => {
        if (!dateString) return "Belgilanmagan"
        return new Date(dateString).toLocaleDateString("uz-UZ", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
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
                return <Clock size={20} />
            case "tasdiqlangan":
            case "in_progress":
                return <RefreshCw size={20} />
            case "completed":
                return <CheckCircle size={20} />
            case "cancelled":
                return <XCircle size={20} />
            default:
                return <AlertCircle size={20} />
        }
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
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Buyurtma ma'lumotlari yuklanmoqda...</p>
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
                        <div className="flex flex-col gap-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                                onClick={fetchOrder}
                            >
                                <RefreshCw size={16} />
                                Qayta urinish
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 shadow-lg"
                                onClick={() => navigate("/buyurtma/user")}
                            >
                                <ArrowLeft size={16} />
                                Buyurtmalarga qaytish
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 flex items-center justify-center">
                <div className="text-center">
                    <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Buyurtma ma'lumotlari topilmadi</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-2xl font-bold">Buyurtma #{order.orderNumber}</h1>
                                <p className="text-blue-100 mt-1">Buyurtma tafsilotlari</p>
                            </div>
                            <div className="text-right">
                                <span
                                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                                        order.status,
                                    )}`}
                                >
                                    {getStatusIcon(order.status)}
                                    {getStatusText(order.status)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Mahsulot ma'lumotlari */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    <Package size={20} />
                                    Mahsulot ma'lumotlari
                                </h3>

                                <div className="space-y-3">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Mahsulot nomi</label>
                                        <p className="text-gray-900 dark:text-gray-100 font-medium">{order.productName}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Kategoriya</label>
                                        <p className="text-gray-900 dark:text-gray-100">{order.category}</p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Tavsif</label>
                                        <p className="text-gray-900 dark:text-gray-100">{order.description}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <DollarSign size={16} className="text-green-600" />
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Narx</label>
                                            <p className="text-gray-900 dark:text-gray-100 font-semibold">
                                                {order.price ? `${order.price.toLocaleString()} UZS` : "Belgilanmagan"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Buyurtma ma'lumotlari */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                    <User size={20} />
                                    Buyurtma ma'lumotlari
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-blue-600" />
                                        <div>
                                            <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Uchrashuv sanasi</label>
                                            <p className="text-gray-900 dark:text-gray-100">{formatDate(order.appointmentDate)}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Ustunlik</label>
                                        <p className="text-gray-900 dark:text-gray-100">{order.priority || "Belgilanmagan"}</p>
                                    </div>

                                    {order.assignedMaster && (
                                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Biriktirilgan Master</h4>
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <User size={16} className="text-purple-600" />
                                                    <span className="text-gray-900 dark:text-gray-100">{order.assignedMaster}</span>
                                                </div>
                                                {order.masterPhone && (
                                                    <div className="flex items-center gap-2">
                                                        <Phone size={16} className="text-green-600" />
                                                        <span className="text-gray-900 dark:text-gray-100">{order.masterPhone}</span>
                                                    </div>
                                                )}
                                                {order.masterEmail && (
                                                    <div className="flex items-center gap-2">
                                                        <Mail size={16} className="text-blue-600" />
                                                        <span className="text-gray-900 dark:text-gray-100">{order.masterEmail}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Manzil */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                                <MapPin size={20} />
                                Manzil
                            </h3>
                            <p className="text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
                                {order.address}
                            </p>
                        </div>

                        {/* Vaqt ma'lumotlari */}
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
                                <Clock size={20} />
                                Vaqt ma'lumotlari
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Yaratilgan</label>
                                    <p className="text-gray-900 dark:text-gray-100">{formatDate(order.createdAt)}</p>
                                </div>
                                {order.updatedAt && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Yangilangan</label>
                                        <p className="text-gray-900 dark:text-gray-100">{formatDate(order.updatedAt)}</p>
                                    </div>
                                )}
                                {order.completionTime && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Yakunlangan</label>
                                        <p className="text-gray-900 dark:text-gray-100">{formatDate(order.completionTime)}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-4">
                            {order.status === "pending" && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg"
                                    onClick={() => navigate(`/user-orders/${id}/edit`)}
                                >
                                    <Edit size={16} />
                                    Tahrirlash
                                </motion.button>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 shadow-lg"
                                onClick={() => navigate("/buyurtma/user")}
                            >
                                <ArrowLeft size={16} />
                                Orqaga
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default UserOrderDetails
