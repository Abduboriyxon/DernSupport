import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Package, TrendingUp, RefreshCw, Users, Map, Calendar, AlertCircle } from "lucide-react";
import axiosInstance from "../../../service/Axios";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

// Chart colors
const STATUS_COLORS = {
    completed: "#10B981",
    inProgress: "#F59E0B",
    planned: "#6366F1",
};
const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
    "#6B7280",
    "#14B8A6",
];

// CSRF token cache
let csrfToken = null;
let csrfTokenPromise = null;

function Kpis() {
    // State
    const [masters, setMasters] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [masterData, setMasterData] = useState([]);
    const [regionData, setRegionData] = useState([]);
    const [districtData, setDistrictData] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);
    const [dailyData, setDailyData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [timeRange, setTimeRange] = useState("month");

    // Fetch data
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const fetchWithFallback = async (url, fallback = []) => {
                try {
                    const response = await axiosInstance.get(url);
                    return response.data;
                } catch (err) {
                    return fallback;
                }
            };

            const [mastersRes, ordersRes, usersRes] = await Promise.all([
                fetchWithFallback("/masters"),
                fetchWithFallback("/orders"),
                fetchWithFallback("/user/support/user"),
            ]);

            const mastersData = mastersRes?.data?.masters || Array.isArray(mastersRes) ? mastersRes : mastersRes?.data || [];
            const ordersData = Array.isArray(ordersRes) ? ordersRes : ordersRes?.data || [];
            const usersData = Array.isArray(usersRes) ? usersRes : usersRes?.data || [];

            setMasters(mastersData);
            setOrders(ordersData);
            setUsers(usersData);

            processData(mastersData, ordersData, usersData);
        } catch (err) {
            setError("Ma'lumotlarni yuklashda xato yuz berdi");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Process data
    const processData = useCallback((masters, orders, users) => {
        setMasterData(processMasterData(masters, orders));
        setRegionData(processRegionData(orders));
        setDistrictData(processDistrictData(orders));
        setMonthlyData(processMonthlyData(orders));
        setDailyData(processDailyData(orders));
    }, []);

    // Process master data
    function processMasterData(masters, orders) {
        if (!Array.isArray(masters) || !Array.isArray(orders)) return [];

        const masterOrderMap = {};
        masters.forEach((master) => {
            const masterId = master._id || master.id;
            masterOrderMap[masterId] = {
                name: master.name || master.fullName || `Master ${masterId} `,
                completed: 0,
                inProgress: 0,
                planned: 0,
                total: 0,
                completionRate: 0,
            };
        });

        orders.forEach((order) => {
            const masterId = order.kimga || order.specialist || order.masterId;
            if (masterId && masterOrderMap[masterId]) {
                masterOrderMap[masterId].total++;
                const status = order.status?.toLowerCase();
                if (["tasdiqlangan", "arxiv", "completed"].includes(status)) {
                    masterOrderMap[masterId].completed++;
                } else if (["jarayonda", "in_progress"].includes(status)) {
                    masterOrderMap[masterId].inProgress++;
                } else if (["yangi", "new", "pending"].includes(status)) {
                    masterOrderMap[masterId].planned++;
                }
            }
        });

        return Object.values(masterOrderMap)
            .map((master) => ({
                ...master,
                completionRate: master.total > 0 ? Math.round((master.completed / master.total) * 100) : 0,
            }))
            .filter((master) => master.total > 0);
    }

    // Process region data
    function processRegionData(orders) {
        if (!Array.isArray(orders)) return [];

        const regionCounts = {};
        orders.forEach((order) => {
            const city = order.address
                ? typeof order.address === "string"
                    ? order.address.split(",")[0]?.trim() || "Noma'lum"
                    : order.address.city || "Noma'lum"
                : "Noma'lum";
            regionCounts[city] = (regionCounts[city] || 0) + 1;
        });

        return Object.entries(regionCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8);
    }

    // Process district data
    function processDistrictData(orders) {
        if (!Array.isArray(orders)) return [];

        const districtCounts = {};
        orders.forEach((order) => {
            const district = order.address
                ? typeof order.address === "string"
                    ? order.address.split(",")[1]?.trim() || order.address.split(",")[0]?.trim() || "Noma'lum"
                    : order.address.district || "Noma'lum"
                : "Noma'lum";
            districtCounts[district] = (districtCounts[district] || 0) + 1;
        });

        return Object.entries(districtCounts)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 10);
    }

    // Process monthly data
    function processMonthlyData(orders) {
        if (!Array.isArray(orders)) return [];

        const months = ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"];
        const monthlyData = months.map((name) => ({
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
                monthlyData[monthIndex].total++;
                const status = order.status?.toLowerCase();
                if (["tasdiqlangan", "arxiv", "completed"].includes(status)) {
                    monthlyData[monthIndex].completed++;
                } else if (["jarayonda", "in_progress"].includes(status)) {
                    monthlyData[monthIndex].inProgress++;
                } else if (["yangi", "new", "pending"].includes(status)) {
                    monthlyData[monthIndex].planned++;
                }
            }
        });

        return monthlyData;
    }

    // Process daily data
    function processDailyData(orders) {
        if (!Array.isArray(orders)) return [];

        const today = new Date();
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);

        const dailyData = Array.from({ length: 30 }, (_, i) => {
            const date = new Date(thirtyDaysAgo);
            date.setDate(date.getDate() + i);
            return { name: `${date.getDate()} `, date, value: 0 };
        });

        orders.forEach((order) => {
            const orderDate = new Date(order.orderDate || order.createdAt);
            if (isNaN(orderDate.getTime()) || orderDate < thirtyDaysAgo || orderDate > today) return;

            const dayIndex = Math.floor((orderDate - thirtyDaysAgo) / (24 * 60 * 60 * 1000));
            if (dayIndex >= 0 && dayIndex < 30) {
                dailyData[dayIndex].value++;
            }
        });

        return dailyData;
    }

    // Computed totals
    const totalOrders = useMemo(() => orders.length || 0, [orders]);
    const completedOrders = useMemo(
        () =>
            orders.filter((order) => ["tasdiqlangan", "arxiv", "completed"].includes(order.status?.toLowerCase())).length || 0,
        [orders]
    );
    const inProgressOrders = useMemo(
        () => orders.filter((order) => ["jarayonda", "in_progress"].includes(order.status?.toLowerCase())).length || 0,
        [orders]
    );
    const plannedOrders = useMemo(
        () => orders.filter((order) => ["yangi", "new", "pending"].includes(order.status?.toLowerCase())).length || 0,
        [orders]
    );
    const completionRate = useMemo(
        () => (totalOrders > 0 ? Math.round((completedOrders / totalOrders) * 100) : 0),
        [totalOrders, completedOrders]
    );

    // Fetch data on mount and timeRange change
    useEffect(() => {
        fetchData();
    }, [fetchData, timeRange]);

    // Chart configurations
    const masterPerformanceChart = {
        type: "bar",
        data: {
            labels: masterData.map((d) => d.name),
            datasets: [
                {
                    label: "Bajarilgan",
                    data: masterData.map((d) => d.completed),
                    backgroundColor: STATUS_COLORS.completed,
                    borderRadius: 4,
                    stack: "Stack 0",
                },
                {
                    label: "Jarayonda",
                    data: masterData.map((d) => d.inProgress),
                    backgroundColor: STATUS_COLORS.inProgress,
                    borderRadius: 4,
                    stack: "Stack 0",
                },
                {
                    label: "Rejalashtirilgan",
                    data: masterData.map((d) => d.planned),
                    backgroundColor: STATUS_COLORS.planned,
                    borderRadius: 4,
                    stack: "Stack 0",
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: "y",
            scales: {
                x: { stacked: true, grid: { display: false }, title: { display: true, text: "Buyurtmalar" } },
                y: { stacked: true, grid: { display: false } },
            },
            plugins: {
                legend: { position: "top" },
                tooltip: {
                    backgroundColor: "#ffffff",
                    titleColor: "#1f2937",
                    bodyColor: "#1f2937",
                    borderColor: "#e5e7eb",
                    borderWidth: 1,
                    cornerRadius: 6,
                },
            },
        },
    };

    const monthlyTrendChart = {
        type: "line",
        data: {
            labels: monthlyData.map((d) => d.name),
            datasets: [
                {
                    label: "Jami",
                    data: monthlyData.map((d) => d.total),
                    borderColor: COLORS[0],
                    backgroundColor: COLORS[0],
                    fill: false,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
                {
                    label: "Bajarilgan",
                    data: monthlyData.map((d) => d.completed),
                    borderColor: STATUS_COLORS.completed,
                    backgroundColor: STATUS_COLORS.completed,
                    fill: false,
                    tension: 0.4,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { grid: { display: false }, title: { display: true, text: "Oylar" } },
                y: { grid: { borderDash: [3, 3] }, title: { display: true, text: "Buyurtmalar" } },
            },
            plugins: {
                legend: { position: "top" },
                tooltip: {
                    backgroundColor: "#ffffff",
                    titleColor: "#1f2937",
                    bodyColor: "#1f2937",
                    borderColor: "#e5e7eb",
                    borderWidth: 1,
                    cornerRadius: 6,
                },
            },
        },
    };

    const regionDistributionChart = {
        type: "pie",
        data: {
            labels: regionData.map((d) => d.name),
            datasets: [
                {
                    data: regionData.map((d) => d.value),
                    backgroundColor: COLORS,
                    borderColor: "#ffffff",
                    borderWidth: 2,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "right" },
                tooltip: {
                    backgroundColor: "#ffffff",
                    titleColor: "#1f2937",
                    bodyColor: "#1f2937",
                    borderColor: "#e5e7eb",
                    borderWidth: 1,
                    cornerRadius: 6,
                    callbacks: {
                        label: (context) => {
                            const total = regionData.reduce((sum, d) => sum + d.value, 0);
                            return `${context.label}: ${context.raw} (${((context.raw / total) * 100).toFixed(1)}%)`;
                        },
                    },
                },
            },
        },
    };

    const districtDistributionChart = {
        type: "bar",
        data: {
            labels: districtData.map((d) => d.name),
            datasets: [
                {
                    label: "Buyurtmalar",
                    data: districtData.map((d) => d.value),
                    backgroundColor: COLORS,
                    borderRadius: 4,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: { display: false },
                    title: { display: true, text: "Tumanlar" },
                    ticks: { maxRotation: 45, minRotation: 45 },
                },
                y: { grid: { borderDash: [3, 3] }, title: { display: true, text: "Buyurtmalar" } },
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#ffffff",
                    titleColor: "#1f2937",
                    bodyColor: "#1f2937",
                    borderColor: "#e5e7eb",
                    borderWidth: 1,
                    cornerRadius: 6,
                    callbacks: { label: (context) => `${context.raw} buyurtma` },
                },
            },
        },
    };

    const masterCompletionRateChart = {
        type: "bar",
        data: {
            labels: masterData.map((d) => d.name),
            datasets: [
                {
                    label: "Bajarilish darajasi (%)",
                    data: masterData.map((d) => d.completionRate),
                    backgroundColor: masterData.map((d) =>
                        d.completionRate > 80 ? STATUS_COLORS.completed : d.completionRate > 50 ? STATUS_COLORS.inProgress : "#EF4444"
                    ),
                    borderRadius: 4,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { grid: { display: false }, title: { display: true, text: "Masterlar" } },
                y: {
                    grid: { borderDash: [3, 3] },
                    title: { display: true, text: "Bajarilish darajasi (%)" },
                    max: 100,
                },
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#ffffff",
                    titleColor: "#1f2937",
                    bodyColor: "#1f2937",
                    borderColor: "#e5e7eb",
                    borderWidth: 1,
                    cornerRadius: 6,
                    callbacks: { label: (context) => `${context.raw}% ` },
                },
            },
        },
    };

    const dailyTrendChart = {
        type: "line",
        data: {
            labels: dailyData.map((d) => d.name),
            datasets: [
                {
                    label: "Buyurtmalar",
                    data: dailyData.map((d) => d.value),
                    borderColor: STATUS_COLORS.planned,
                    backgroundColor: "rgba(99, 102, 241, 0.2)",
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { grid: { display: false }, title: { display: true, text: "Kunlar" } },
                y: { grid: { borderDash: [3, 3] }, title: { display: true, text: "Buyurtmalar" } },
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: "#ffffff",
                    titleColor: "#1f2937",
                    bodyColor: "#1f2937",
                    borderColor: "#e5e7eb",
                    borderWidth: 1,
                    cornerRadius: 6,
                    callbacks: { label: (context) => `${context.raw} buyurtma` },
                },
            },
        },
    };

    // Loading state
    if (isLoading) {
        return (
            <motion.div
                className="p-4 sm:p-6 md:p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="text-center"
                >
                    <RefreshCw className="h-12 w-12 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Ko'rsatgichlar yuklanmoqda...</p>
                </motion.div>
            </motion.div>
        );
    }

    // Error state
    if (error) {
        return (
            <motion.div
                className="p-4 sm:p-6 md:p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-md p-8 max-w-md w-full border border-white/20 dark:border-gray-700/20"
                >
                    <div className="flex items-center justify-center mb-4">
                        <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
                            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 text-center mb-2">Xatolik</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-center mb-6">{error}</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-2 text-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-md hover:from-blue-600 hover:to-blue-700"
                        onClick={() => window.location.reload()}
                    >
                        Qayta yuklash
                    </motion.button>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="p-4 sm:p-6 md:p-8 min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Header */}
            <div className="mb-8">
                <motion.h1
                    className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    Ko'rsatgichlar (KPI)
                </motion.h1>
                <motion.p
                    className="mt-2 text-gray-600 dark:text-gray-400"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    Buyurtmalar va masterlar statistikasi
                </motion.p>
            </div>

            {/* Controls */}
            <motion.div
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-md p-4 mb-6 border border-white/20 dark:border-gray-700/20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
            >
                <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex gap-2 p-2 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg">
                        {["week", "month", "quarter", "year"].map((range) => (
                            <motion.button
                                key={range}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`px - 3 py - 1.5 rounded - md text - sm font - medium ${timeRange === range
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    } `}
                                onClick={() => setTimeRange(range)}
                            >
                                {range === "week" ? "Hafta" : range === "month" ? "Oy" : range === "quarter" ? "Chorak" : "Yil"}
                            </motion.button>
                        ))}
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="ml-auto flex items-center gap-1.5 px-3 py-2 bg-white/50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm"
                        onClick={() => window.location.reload()}
                    >
                        <RefreshCw size={16} />
                        <span>Yangilash</span>
                    </motion.button>
                </div>
            </motion.div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {[
                    {
                        title: "Jami buyurtmalar",
                        value: totalOrders,
                        icon: Package,
                        color: "from-blue-500 to-blue-600",
                        darkColor: "dark:from-blue-600 dark:to-blue-700",
                        iconBg: "bg-blue-100 text-blue-600",
                        darkIconBg: "dark:bg-blue-900/30 dark:text-blue-400",
                        stat: "+12.5%",
                        statLabel: "O'tgan oyga nisbatan",
                    },
                    {
                        title: "Bajarilgan",
                        value: completedOrders,
                        icon: TrendingUp,
                        color: "from-green-500 to-emerald-500",
                        darkColor: "dark:from-green-600 dark:to-emerald-600",
                        iconBg: "bg-green-100 text-green-600",
                        darkIconBg: "dark:bg-green-900/30 dark:text-green-400",
                        stat: `${completionRate}% `,
                        statLabel: "Bajarilish darajasi",
                        progress: completionRate,
                    },
                    {
                        title: "Jarayonda",
                        value: inProgressOrders,
                        icon: RefreshCw,
                        color: "from-amber-500 to-orange-500",
                        darkColor: "dark:from-amber-600 dark:to-orange-600",
                        iconBg: "bg-amber-100 text-amber-600",
                        darkIconBg: "dark:bg-amber-900/30 dark:text-amber-400",
                        stat: `${totalOrders > 0 ? Math.round((inProgressOrders / totalOrders) * 100) : 0}% `,
                        statLabel: "Jami buyurtmalardan",
                        progress: totalOrders > 0 ? Math.round((inProgressOrders / totalOrders) * 100) : 0,
                    },
                    {
                        title: "Faol masterlar",
                        value: masters.length,
                        icon: Users,
                        color: "from-violet-500 to-violet-600",
                        darkColor: "dark:from-violet-600 dark:to-violet-700",
                        iconBg: "bg-violet-100 text-violet-600",
                        darkIconBg: "dark:bg-violet-900/30 dark:text-violet-400",
                        stat: `${masters.length > 0 ? Math.round(totalOrders / masters.length) : 0} ta`,
                        statLabel: "O'rtacha buyurtmalar",
                    },
                ].map((card, index) => (
                    <motion.div
                        key={index}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-white/20 dark:border-gray-700/20"
                        whileHover={{ scale: 1.03, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                    >
                        <div className={`h - 2 bg - gradient - to - r ${card.color} ${card.darkColor} `}></div>
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p - 3 rounded - lg ${card.iconBg} ${card.darkIconBg} `}>
                                    <card.icon className="h-6 w-6" />
                                </div>
                                <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{card.title}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{card.value}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{card.title}</p>
                            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{card.statLabel}</span>
                                    <span className="text-xs font-medium text-gray-800 dark:text-gray-200">{card.stat}</span>
                                </div>
                                {card.progress !== undefined && (
                                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-2">
                                        <div
                                            className={`h - full rounded - full bg - gradient - to - r ${card.color} ${card.darkColor} `}
                                            style={{ width: `${card.progress}% ` }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Master Performance Chart */}
                <motion.div
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-md p-6 border border-white/20 dark:border-gray-700/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Masterlar bo'yicha buyurtmalar</h2>
                        <div className="flex items-center gap-4">
                            {[
                                { color: STATUS_COLORS.completed, label: "Bajarilgan" },
                                { color: STATUS_COLORS.inProgress, label: "Jarayonda" },
                                { color: STATUS_COLORS.planned, label: "Rejalashtirilgan" },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="h-80">
                        <Bar data={masterPerformanceChart.data} options={masterPerformanceChart.options} />
                    </div>
                </motion.div>

                {/* Monthly Trend Chart */}
                <motion.div
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-md p-6 border border-white/20 dark:border-gray-700/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Oylik ko'rsatkichlar</h2>
                        <div className="flex items-center gap-4">
                            {[
                                { color: COLORS[0], label: "Jami" },
                                { color: STATUS_COLORS.completed, label: "Bajarilgan" },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center gap-1.5">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                    <span className="text-xs text-gray-600 dark:text-gray-400">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="h-80">
                        <Line data={monthlyTrendChart.data} options={monthlyTrendChart.options} />
                    </div>
                </motion.div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Region Distribution */}
                <motion.div
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-md p-6 border border-white/20 dark:border-gray-700/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Viloyatlar bo'yicha</h2>
                        <div className="flex items-center gap-2">
                            <Map size={16} className="text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Geografik taqsimot</span>
                        </div>
                    </div>
                    <div className="h-80 flex items-center justify-center">
                        <Pie data={regionDistributionChart.data} options={regionDistributionChart.options} />
                    </div>
                </motion.div>

                {/* District Distribution */}
                <motion.div
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-md p-6 border border-white/20 dark:border-gray-700/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Tumanlar bo'yicha</h2>
                        <div className="flex items-center gap-2">
                            <Map size={16} className="text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Toshkent shahri</span>
                        </div>
                    </div>
                    <div className="h-80">
                        <Bar data={districtDistributionChart.data} options={districtDistributionChart.options} />
                    </div>
                </motion.div>
            </div>

            {/* Charts Row 3 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Master Completion Rate */}
                <motion.div
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-md p-6 border border-white/20 dark:border-gray-700/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Masterlar samaradorligi</h2>
                        <div className="flex items-center gap-2">
                            <TrendingUp size={16} className="text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Bajarilish darajasi</span>
                        </div>
                    </div>
                    <div className="h-80">
                        <Bar data={masterCompletionRateChart.data} options={masterCompletionRateChart.options} />
                    </div>
                </motion.div>

                {/* Daily Trend */}
                <motion.div
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-md p-6 border border-white/20 dark:border-gray-700/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Kunlik ko'rsatkichlar</h2>
                        <div className="flex items-center gap-2">
                            <Calendar size={16} className="text-gray-500 dark:text-gray-400" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">Oxirgi 30 kun</span>
                        </div>
                    </div>
                    <div className="h-80">
                        <Line data={dailyTrendChart.data} options={dailyTrendChart.options} />
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

export default Kpis;
