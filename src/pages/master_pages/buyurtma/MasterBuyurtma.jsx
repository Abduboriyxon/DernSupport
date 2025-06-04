import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, AlertCircle, RefreshCw, Clock, CheckCircle, Edit2, Package, User, Phone, MapPin } from "lucide-react";
import axiosInstance from "../../../service/Axios";

const MasterOrders = () => {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get("/orders/buyurtma/master");
                const ordersData = Array.isArray(response.data) ? response.data : [];
                setOrders(ordersData);
                setError(null);
            } catch (err) {
                setError(err.message || "Buyurtmalarni yuklashda xatolik yuz berdi");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Status info
    const getStatusInfo = (status) => {
        const normalizedStatus = status?.toLowerCase() || "unknown";
        switch (normalizedStatus) {
            case "jarayonda":
                return {
                    icon: Clock,
                    color: "text-amber-600",
                    bg: "bg-amber-100 dark:bg-amber-900/30",
                    label: "Jarayonda",
                };
            case "tasdiqlangan":
                return {
                    icon: CheckCircle,
                    color: "text-green-600",
                    bg: "bg-green-100 dark:bg-green-900/30",
                    label: "Tasdiqlangan",
                };
            default:
                return {
                    icon: AlertCircle,
                    color: "text-gray-600",
                    bg: "bg-gray-100 dark:bg-gray-900/30",
                    label: "Noma'lum",
                };
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto dark:text-blue-400" />
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 font-medium">Buyurtmalar yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 flex items-center justify-center">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20 text-center w-full max-w-sm">
                    <AlertCircle className="h-6 w-6 text-red-600 mx-auto" />
                    <h3 className="mt-2 text-base font-semibold text-gray-900 dark:text-gray-100">Xatolik</h3>
                    <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md"
                    >
                        Qayta yuklash
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">Buyurtmalar</h1>

                {/* Orders Table/Cards */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 dark:border-gray-700/20">
                    <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                    {orders.length ? (
                        <div className="overflow-x-auto">
                            {/* Table for desktop */}
                            <table className="w-full text-left hidden sm:table">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                                        <th className="p-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">ID</th>
                                        <th className="p-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Mijoz</th>
                                        <th className="p-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Telefon</th>
                                        <th className="p-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Mahsulot ID</th>
                                        <th className="p-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                                        <th className="p-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Amallar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => {
                                        const statusInfo = getStatusInfo(order.status);
                                        return (
                                            <tr
                                                key={order.id}
                                                className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50"
                                            >
                                                <td className="p-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100">#{order.id}</td>
                                                <td className="p-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100">{order.customerName || "Noma'lum"}</td>
                                                <td className="p-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100">{order.phone || "Noma'lum"}</td>
                                                <td className="p-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100">{order.productId || "Noma'lum"}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                </td>
                                                <td className="p-3 flex gap-2">
                                                    <button
                                                        onClick={() => navigate(`/orders/${order.id}`)}
                                                        className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-sm flex items-center gap-1"
                                                    >
                                                        <Eye size={14} /> Ko'rish
                                                    </button>
                                                    {order.status?.toLowerCase() === "jarayonda" && (
                                                        <button
                                                            onClick={() => navigate(`/orders/${order.id}/edit`)}
                                                            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-xs sm:text-sm rounded-lg hover:from-emerald-700 hover:to-green-700 shadow-sm flex items-center gap-1"
                                                        >
                                                            <Edit2 size={14} /> Tahrirlash
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {/* Cards for mobile */}
                            <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-700">
                                {orders.map((order) => {
                                    const statusInfo = getStatusInfo(order.status);
                                    return (
                                        <div key={order.id} className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">#{order.id} {order.customerName || "Noma'lum"}</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Telefon: {order.phone || "Noma'lum"}</p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">Mahsulot ID: {order.productId || "Noma'lum"}</p>
                                                    <span className={`mt-1 inline-block px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => navigate(`/orders/${order.id}`)}
                                                        className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-sm flex items-center gap-1"
                                                    >
                                                        <Eye size={14} /> Ko'rish
                                                    </button>
                                                    {order.status?.toLowerCase() === "jarayonda" && (
                                                        <button
                                                            onClick={() => navigate(`/orders/${order.id}/edit`)}
                                                            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-xs rounded-lg hover:from-emerald-700 hover:to-green-700 shadow-sm flex items-center gap-1"
                                                        >
                                                            <Edit2 size={14} /> Tahrirlash
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Package className="h-10 w-10 text-gray-400 mx-auto" />
                            <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Buyurtmalar topilmadi</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Hozircha hech qanday buyurtma yo'q.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MasterOrders;