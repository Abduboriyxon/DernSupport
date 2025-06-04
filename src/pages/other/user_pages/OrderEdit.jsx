"use client"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { AlertCircle, Save, XCircle, ArrowLeft, RefreshCw } from "lucide-react"
import { getUserOrderById, updateUserOrder } from "../../../service/userOrderService"

const UserOrderEdit = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [order, setOrder] = useState({
        productName: "",
        category: "",
        description: "",
        address: "",
        appointmentDate: "",
        price: 0,
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(false)

    const fetchOrder = async () => {
        setLoading(true)
        setError(null)
        try {
            const response = await getUserOrderById(id)
            const data = response.data
            setOrder({
                productName: data.productName || "",
                category: data.category || "",
                description: data.description || "",
                address: data.address || "",
                appointmentDate: data.appointmentDate ? new Date(data.appointmentDate).toISOString().split("T")[0] : "",
                price: data.price || 0,
            })
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError(null)
        setSuccess(false)

        try {
            await updateUserOrder(id, {
                price: order.price,
                appointmentDate: order.appointmentDate,
                description: order.description,
            })
            setSuccess(true)
            setTimeout(() => {
                navigate(`/user-orders/${id}`)
            }, 1500)
        } catch (err) {
            console.error("Buyurtmani yangilashda xato:", err)
            setError(err.response?.data?.message || "Buyurtmani yangilashda xato yuz berdi")
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setOrder((prev) => ({
            ...prev,
            [name]: name === "price" ? Number.parseFloat(value) || 0 : value,
        }))
        setError(null)
        setSuccess(false)
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
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Buyurtma yuklanmoqda...</p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
            <div className="max-w-2xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Buyurtmani Tahrirlash</h2>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/user-orders/${id}`)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200"
                        >
                            <ArrowLeft size={16} />
                            Orqaga
                        </motion.button>
                    </div>

                    {error && (
                        <motion.div
                            className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-xl flex items-center gap-3"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                            <p className="text-red-700 dark:text-red-300">{error}</p>
                        </motion.div>
                    )}

                    {success && (
                        <motion.div
                            className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 rounded-xl flex items-center gap-3"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Save className="w-5 h-5 text-green-600 dark:text-green-400" />
                            <p className="text-green-700 dark:text-green-300">Buyurtma muvaffaqiyatli yangilandi!</p>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mahsulot Nomi</label>
                            <input
                                type="text"
                                value={order.productName}
                                disabled
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Bu maydonni o'zgartirib bo'lmaydi</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kategoriya</label>
                            <input
                                type="text"
                                value={order.category}
                                disabled
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Bu maydonni o'zgartirib bo'lmaydi</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tavsif <span className="text-green-600">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={order.description}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                placeholder="Buyurtma haqida batafsil ma'lumot..."
                                disabled={saving}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Manzil</label>
                            <input
                                type="text"
                                value={order.address}
                                disabled
                                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 cursor-not-allowed"
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Bu maydonni o'zgartirib bo'lmaydi</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Narx (UZS) <span className="text-green-600">*</span>
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={order.price}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                min="0"
                                step="1000"
                                disabled={saving}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Uchrashuv Sanasi <span className="text-green-600">*</span>
                            </label>
                            <input
                                type="date"
                                name="appointmentDate"
                                value={order.appointmentDate}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                                disabled={saving}
                            />
                        </div>

                        <div className="flex gap-4 pt-4">
                            <motion.button
                                type="submit"
                                whileHover={!saving ? { scale: 1.05 } : {}}
                                whileTap={!saving ? { scale: 0.95 } : {}}
                                className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={saving}
                            >
                                {saving ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <RefreshCw size={16} className="animate-spin" />
                                        Saqlanmoqda...
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center gap-2">
                                        <Save size={16} />
                                        Saqlash
                                    </div>
                                )}
                            </motion.button>

                            <motion.button
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(`/user-orders/${id}`)}
                                className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200 shadow-lg font-medium"
                                disabled={saving}
                            >
                                <XCircle size={16} className="inline mr-2" />
                                Bekor qilish
                            </motion.button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </div>
    )
}

export default UserOrderEdit
