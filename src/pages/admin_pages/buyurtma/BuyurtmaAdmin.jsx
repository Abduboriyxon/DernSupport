import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Send, Search, Filter, Clock, Archive, AlertCircle, FileCheck, User, Phone, MapPin, ShoppingCart, RefreshCw, CheckCircle } from "lucide-react";
import axiosInstance from "../../../service/Axios";

const AdminOrders = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState("hammasi");
    const [searchTerm, setSearchTerm] = useState("");
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Fetch orders
    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            try {
                const { data } = await axiosInstance.get("/orders");
                setOrders(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                setError(err.message || "Buyurtmalarni yuklashda xato");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    // Handle status change
    const handleStatusChange = useCallback(async (orderId, newStatus) => {
        try {
            const { data } = await axiosInstance.patch(`/orders/${orderId}/status`, { status: newStatus });
            setOrders((prev) => prev.map((order) => order.id === orderId ? { ...order, status: data.data.status } : order));
        } catch (err) {
            setError(err.message || "Statusni o'zgartirishda xato");
        }
    }, []);

    // Status info
    const getStatusInfo = (status) => {
        const normalized = status?.toLowerCase();
        const statusMap = {
            yangi: { icon: AlertCircle, color: "text-blue-600", bg: "bg-gradient-to-r from-blue-500 to-blue-600", label: "Yangi" },
            jarayonda: { icon: Clock, color: "text-amber-600", bg: "bg-gradient-to-r from-amber-500 to-orange-500", label: "Jarayonda" },
            kutilmoqda: { icon: Clock, color: "text-yellow-600", bg: "bg-gradient-to-r from-yellow-500 to-yellow-600", label: "Kutilmoqda" },
            tasdiqlangan: { icon: FileCheck, color: "text-green-600", bg: "bg-gradient-to-r from-green-500 to-emerald-500", label: "Tasdiqlangan" },
            arxiv: { icon: Archive, color: "text-gray-600", bg: "bg-gradient-to-r from-gray-500 to-gray-600", label: "Arxiv" },
        };
        return statusMap[normalized] || { icon: AlertCircle, color: "text-gray-600", bg: "bg-gradient-to-r from-gray-500 to-gray-600", label: "Noma'lum" };
    };

    // Filter stats
    const filters = [
        { id: "hammasi", label: "Hammasi", count: orders.length },
        { id: "yangilar", label: "Yangilar", count: orders.filter((o) => o.status?.toLowerCase() === "yangi").length },
        { id: "jarayonda", label: "Jarayonda", count: orders.filter((o) => o.status?.toLowerCase() === "jarayonda").length },
        { id: "kutilmoqda", label: "Kutilmoqda", count: orders.filter((o) => o.status?.toLowerCase() === "kutilmoqda").length },
        { id: "tasdiqlangan", label: "Tasdiqlangan", count: orders.filter((o) => o.status?.toLowerCase() === "tasdiqlangan").length },
        { id: "arxiv", label: "Arxiv", count: orders.filter((o) => o.status?.toLowerCase() === "arxiv").length },
    ];

    // Filter orders
    const filteredOrders = orders
        .filter((order) => {
            const status = order.status?.toLowerCase() || "";
            const filterStatus = activeFilter === "hammasi" ? "all" : activeFilter;
            return filterStatus === "all" || status === filterStatus;
        })
        .filter((order) =>
            searchTerm
                ? order.id?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.customerName?.toLowerCase().includes(searchTerm.toLowerCase())
                : true
        );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="h-10 w-10 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Buyurtmalar yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 flex items-center justify-center">
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20 text-center max-w-md w-full">
                    <AlertCircle className="h-8 w-8 text-red-600 mx-auto" />
                    <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Xatolik</h3>
                    <p className="mt-1 text-gray-600 dark:text-gray-400">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                    >
                        Qayta yuklash
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-8">Buyurtmalar boshqaruvi</h1>
                <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buyurtma yoki mijoz qidirish..."
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setIsFilterOpen(!isFilterOpen)}
                            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                        >
                            <Filter size={16} />
                            Filter
                        </button>
                        {isFilterOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 dark:border-gray-700/20 z-10">
                                {filters.map((filter) => (
                                    <button
                                        key={filter.id}
                                        onClick={() => {
                                            setActiveFilter(filter.id);
                                            setIsFilterOpen(false);
                                        }}
                                        className={`w-full text-left px-4 py-2 text-sm ${activeFilter === filter.id ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400" : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-700/80"}`}
                                    >
                                        {filter.label} ({filter.count})
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredOrders.length ? (
                        filteredOrders.map((order) => {
                            const statusInfo = getStatusInfo(order.status);
                            return (
                                <div
                                    key={order.id}
                                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/20 dark:border-gray-700/20"
                                >
                                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">#{order.id}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Buyurtma ID</p>
                                            </div>
                                            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white shadow-lg ${statusInfo.bg}`}>
                                                <statusInfo.icon size={14} />
                                                <span>{statusInfo.label}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                                <ShoppingCart className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">Mahsulot ID</p>
                                                <p className="font-semibold text-gray-900 dark:text-gray-100">{order.productId || "Noma'lum"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                                <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Mijoz</p>
                                                <p className="font-semibold text-gray-900 dark:text-gray-100">{order.customerName || "Noma'lum"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                                <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Telefon</p>
                                                <p className="font-semibold text-gray-900 dark:text-gray-100">{order.phone || "Noma'lum"}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                                <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">Manzil</p>
                                                <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{order.address || "Noma'lum"}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => navigate(`/orders/${order.id}`)}
                                                className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm"
                                            >
                                                <Eye size={16} />
                                                Ko'rish
                                            </button>
                                            {order.status === "yangi" && (
                                                <button
                                                    onClick={() => handleStatusChange(order.id, "jarayonda")}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-lg"
                                                >
                                                    <Send size={16} />
                                                    Yuborish
                                                </button>
                                            )}
                                            {order.status === "kutilmoqda" && (
                                                <button
                                                    onClick={() => handleStatusChange(order.id, "tasdiqlangan")}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 shadow-lg"
                                                >
                                                    <CheckCircle size={16} />
                                                    Tasdiqlash
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="col-span-full text-center py-16">
                            <Search className="h-12 w-12 text-gray-400 mx-auto" />
                            <h3 className="mt-2 text-xl font-semibold text-gray-900 dark:text-gray-100">Buyurtmalar topilmadi</h3>
                            <p className="mt-1 text-gray-500 dark:text-gray-400">Boshqa parametrlar bilan qidirishni sinab ko'ring.</p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setActiveFilter("hammasi");
                                }}
                                className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                            >
                                Filterni tozalash
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;