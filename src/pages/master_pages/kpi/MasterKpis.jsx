import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart,
    Line,
    AreaChart,
    Area,
    Cell,
} from "recharts";
import { RefreshCw, TrendingUp, Package, AlertCircle } from "lucide-react";
import axiosInstance from "../../../service/Axios";

// Colors for statuses
const STATUS_COLORS = {
    completed: "#10B981", // Green
    inProgress: "#F59E0B", // Amber
    planned: "#6366F1", // Indigo
};

const MasterKpis = () => {
    const [timeRange, setTimeRange] = useState("month");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [master, setMaster] = useState(null);
    const [orders, setOrders] = useState([]);
    const [masterData, setMasterData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [dailyData, setDailyData] = useState([]);
    const [masterId, setMasterId] = useState(null);

    // Fetch masterId from authentication
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axiosInstance.get("/check-auth");
                setMasterId(res.data.user.id);
            } catch (err) {
                setError("Autentifikatsiya xatosi");
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    // Fetch data when masterId or timeRange changes
    useEffect(() => {
        if (!masterId) return;

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [masterRes, ordersRes] = await Promise.all([
                    axiosInstance.get(`/masters/${masterId}`),
                    axiosInstance.get(`/orders?masterId=${masterId}`),
                ]);

                const masterData = masterRes.data?.data || masterRes.data;
                const ordersData = Array.isArray(ordersRes.data) ? ordersRes.data : [];

                if (!masterData) {
                    throw new Error("Master ma'lumotlari topilmadi");
                }

                setMaster(masterData);
                setOrders(ordersData);

                // Process data for charts
                processData(masterData, ordersData);

                setIsLoading(false);
            } catch (err) {
                setError(err.message || "Ma'lumotlarni yuklashda xatolik yuz berdi");
                setIsLoading(false);
            }
        };

        fetchData();
    }, [masterId, timeRange]);

    // Process data for charts
    const processData = useCallback((master, orders) => {
        setMasterData(processMasterData(master, orders));
        setMonthlyData(processMonthlyData(orders));
        setDailyData(processDailyData(orders));
    }, []);

    // Process master data
    const processMasterData = useCallback((master, orders) => {
        if (!master || !Array.isArray(orders)) return [];

        const masterId = master._id || master.id;
        const masterName = master.name || master.fullName || `Master ${masterId}`;

        const data = {
            name: masterName,
            completed: 0,
            inProgress: 0,
            planned: 0,
            total: 0,
            completionRate: 0,
        };

        orders.forEach((order) => {
            data.total++;
            const status = order.status?.toLowerCase();
            if (["tasdiqlangan", "arxiv", "completed"].includes(status)) {
                data.completed++;
            } else if (["jarayonda", "in_progress"].includes(status)) {
                data.inProgress++;
            } else if (["yangi", "new", "pending"].includes(status)) {
                data.planned++;
            }
        });

        data.completionRate = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0;
        return [data].filter((d) => d.total > 0);
    }, []);

    // Process monthly data
    const processMonthlyData = useCallback((orders) => {
        if (!Array.isArray(orders)) return [];

        const months = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];
        const data = months.map((name) => ({
            name,
            completed: 0,
            inProgress: 0,
            planned: 0,
            total: 0,
        }));

        orders.forEach((order) => {
            const orderDate = new Date(order.orderDate || order.createdAt);
            if (isNaN(orderDate.getTime())) return;

            const monthIndex = orderDate.getMonth();
            if (monthIndex >= 0 && monthIndex < 12) {
                data[monthIndex].total++;
                const status = order.status?.toLowerCase();
                if (["tasdiqlangan", "arxiv", "completed"].includes(status)) {
                    data[monthIndex].completed++;
                } else if (["jarayonda", "in_progress"].includes(status)) {
                    data[monthIndex].inProgress++;
                } else if (["yangi", "new", "pending"].includes(status)) {
                    data[monthIndex].planned++;
                }
            }
        });

        return data;
    }, []);

    // Process daily data
    const processDailyData = useCallback((orders) => {
        if (!Array.isArray(orders)) return [];

        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const data = Array.from({ length: 30 }, (_, i) => {
            const date = new Date(thirtyDaysAgo);
            date.setDate(date.getDate() + i);
            return { name: `${date.getDate()}`, date, value: 0 };
        });

        orders.forEach((order) => {
            const orderDate = new Date(order.orderDate || order.createdAt);
            if (isNaN(orderDate.getTime()) || orderDate < thirtyDaysAgo || orderDate > today) return;

            const dayIndex = Math.floor((orderDate - thirtyDaysAgo) / (24 * 60 * 60 * 1000));
            if (dayIndex >= 0 && dayIndex < 30) {
                data[dayIndex].value++;
            }
        });

        return data;
    }, []);

    // Calculate summary metrics
    const { totalOrders, completedOrders, inProgressOrders, completionRate } = useMemo(() => {
        const total = orders.length;
        const completed = orders.filter((order) =>
            ["tasdiqlangan", "arxiv", "completed"].includes(order.status?.toLowerCase())
        ).length;
        const inProgress = orders.filter((order) =>
            ["jarayonda", "in_progress"].includes(order.status?.toLowerCase())
        ).length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
            totalOrders: total,
            completedOrders: completed,
            inProgressOrders: inProgress,
            completionRate: rate,
        };
    }, [orders]);

    // Custom tooltip for charts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-3 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color }} className="text-sm">
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
                        <RefreshCw className="h-10 w-10 animate-spin text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-4 font-medium">Ko'rsatgichlar yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 flex items-center justify-center">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-white/20 dark:border-gray-700/20 text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Xatolik yuz berdi</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg mx-auto"
                            onClick={() => window.location.reload()}
                        >
                            <RefreshCw size={16} />
                            Qayta urinish
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Master Ko'rsatgichlari
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 text-lg">
                        Sizning buyurtmalaringiz bo'yicha statistika va tahlil
                    </p>
                </motion.div>

                {/* Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-4 shadow-xl border border-white/20 dark:border-gray-700/20 mb-8 flex flex-wrap gap-4 justify-between items-center"
                >
                    <div className="flex gap-2">
                        {["week", "month", "quarter", "year"].map((range) => (
                            <motion.button
                                key={range}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${timeRange === range
                                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    }`}
                                onClick={() => setTimeRange(range)}
                            >
                                {range === "week"
                                    ? "Hafta"
                                    : range === "month"
                                        ? "Oy"
                                        : range === "quarter"
                                            ? "Chorak"
                                            : "Yil"}
                            </motion.button>
                        ))}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                        onClick={() => window.location.reload()}
                    >
                        <RefreshCw size={16} />
                        Yangilash
                    </motion.button>
                </motion.div>

                {/* No Orders Message */}
                <AnimatePresence>
                    {orders.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-center gap-3 shadow-lg"
                        >
                            <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                            <p className="text-sm text-yellow-800 dark:text-yellow-200">
                                Hozircha sizga biriktirilgan buyurtmalar yo'q.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Summary Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
                >
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Jami buyurtmalar</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalOrders}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Bajarilgan</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{completedOrders}</p>
                                <div className="mt-2 w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                                        style={{ width: `${completionRate}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                                <RefreshCw className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Jarayonda</p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{inProgressOrders}</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Master Performance */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sizning buyurtmalaringiz</h2>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Bajarilgan</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Jarayonda</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Rejalashtirilgan</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={masterData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                                    <YAxis tick={{ fill: "#6b7280" }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="completed" name="Bajarilgan" stackId="a" fill={STATUS_COLORS.completed} />
                                    <Bar dataKey="inProgress" name="Jarayonda" stackId="a" fill={STATUS_COLORS.inProgress} />
                                    <Bar dataKey="planned" name="Rejalashtirilgan" stackId="a" fill={STATUS_COLORS.planned} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Completion Rate */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Samaradorlik</h2>
                            <div className="flex items-center gap-2">
                                <TrendingUp size={16} className="text-gray-500 dark:text-gray-400" />
                                <span className="text-sm text-gray-600 dark:text-gray-400">Bajarilish darajasi</span>
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={masterData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                                    <YAxis domain={[0, 100]} tick={{ fill: "#6b7280" }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="completionRate" name="Bajarilish darajasi (%)">
                                        {masterData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    entry.completionRate > 80
                                                        ? "#10B981"
                                                        : entry.completionRate > 50
                                                            ? "#F59E0B"
                                                            : "#EF4444"
                                                }
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Monthly Trend */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Oylik ko'rsatkichlar</h2>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Jami</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">Bajarilgan</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                                    <YAxis tick={{ fill: "#6b7280" }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line
                                        type="monotone"
                                        dataKey="total"
                                        name="Jami"
                                        stroke="#3B82F6"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="completed"
                                        name="Bajarilgan"
                                        stroke="#10B981"
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Daily Trend */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Kunlik ko'rsatkichlar</h2>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Oxirgi 30 kun</span>
                            </div>
                        </div>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={dailyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                                    <YAxis tick={{ fill: "#6b7280" }} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        name="Buyurtmalar"
                                        stroke="#6366F1"
                                        fill="#6366F1"
                                        fillOpacity={0.2}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default MasterKpis;