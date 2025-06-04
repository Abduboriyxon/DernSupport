import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    AlertCircle,
    RefreshCw,
    User,
    Phone,
    MapPin,
    Package,
    Calendar,
    DollarSign,
    CheckCircle,
    Clock,
    Archive,
} from "lucide-react";
import axiosInstance from "../../../service/Axios";

const statusStyles = {
    jarayonda: {
        icon: Clock,
        color: "text-amber-600",
        bg: "bg-gradient-to-r from-amber-500 to-orange-500",
        label: "Jarayonda",
        pulse: true,
    },
    tasdiqlangan: {
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-gradient-to-r from-green-500 to-emerald-500",
        label: "Tasdiqlangan",
        pulse: false,
    },
    default: {
        icon: Archive,
        color: "text-gray-600",
        bg: "bg-gradient-to-r from-gray-500 to-gray-600",
        label: "Noma'lum",
        pulse: false,
    },
};

const getStatusInfo = (status) => {
    if (!status) return statusStyles.default;
    const key = status.toLowerCase();
    return statusStyles[key] || statusStyles.default;
};

const OrderView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get(`/orders/${id}`);
                setOrder(response.data);
                setError(null);
            } catch (err) {
                setError(err.message || "Buyurtma ma'lumotlarini yuklashda xatolik yuz berdi");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
                        <RefreshCw className="h-10 w-10 animate-spin text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-4 font-medium">Buyurtma yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20 text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Xatolik yuz berdi</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{error || "Buyurtma topilmadi"}</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg mx-auto"
                            onClick={() => navigate(-1)}
                        >
                            Orqaga
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const statusInfo = getStatusInfo(order.status);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl w-full mx-auto"
            >
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
                    {/* Header */}
                    <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row items-center md:items-start gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg mb-2">
                                <Package className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                                Buyurtma #{order.id}
                            </h1>
                            <div className="flex items-center gap-3 mb-2">
                                <div
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-lg ${statusInfo.bg
                                        } ${statusInfo.pulse ? "animate-pulse" : ""}`}
                                >
                                    <statusInfo.icon size={16} />
                                    <span>{statusInfo.label}</span>
                                </div>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {order.createdAt}
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">Buyurtma ma'lumotlari</p>
                        </div>
                    </div>
                    {/* Details */}
                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                    <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Mijoz</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{order.customerName}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Telefon</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{order.phone}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Manzil</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{order.address}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Uchrashuv sanasi</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{order.appointmentDate || "Belgilanmagan"}</p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Narxi</p>
                                    <p className="font-bold text-emerald-600 dark:text-emerald-400">
                                        {Number(order.price).toLocaleString()} so'm
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700/30 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Mahsulot nomi</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{order.productName}</p>
                                    <p className="text-xs text-gray-400 dark:text-gray-500">{order.category}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Tamomlash vaqti</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{order.completionTime || "Belgilanmagan"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700/30 rounded-lg flex items-center justify-center">
                                    <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Biriktirilgan master</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{order.assignedMaster || "Belgilanmagan"}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Description & Priority */}
                    <div className="px-8 pb-8">
                        <div className="mb-4">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Tavsif</p>
                            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 text-gray-900 dark:text-gray-100 text-sm">
                                {order.description}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Buyurtma ID</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{order.id}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Mahsulot ID</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{order.productId}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Ustuvorlik</p>
                                <p className="font-medium text-gray-900 dark:text-gray-100">{order.priority}</p>
                            </div>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-8 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                            onClick={() => navigate(-1)}
                        >
                            Orqaga
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderView;