import { useState, useEffect, useCallback } from "react";
import { Search, User, Eye, AlertCircle, RefreshCw, CheckCircle, XCircle, Clock, X, Package, Phone, MapPin, Calendar, Filter } from "lucide-react";
import axiosInstance from "../../../service/Axios";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Fetch users
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const { data } = await axiosInstance.get("/user/support/user");
            const usersData = Array.isArray(data) ? data : [];
            setUsers(usersData);
            setFilteredUsers(usersData);
        } catch (err) {
            setError("Foydalanuvchilarni yuklashda xato");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Filter users
    useEffect(() => {
        let result = users.filter(
            (user) =>
                !searchTerm ||
                user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.phone?.includes(searchTerm) ||
                user.id?.toString().includes(searchTerm)
        );
        if (statusFilter !== "all") {
            result = result.filter((user) => user.status === statusFilter);
        }
        setFilteredUsers(result);
    }, [users, searchTerm, statusFilter]);

    // Status badge styles
    const getStatusBadgeStyle = (status) => {
        return status === "active"
            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
            : status === "inactive"
                ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400"
                : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    };

    // Open modal
    const viewUserDetails = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto dark:text-blue-400" />
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 font-medium">Foydalanuvchilar yuklanmoqda...</p>
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
                        onClick={fetchUsers}
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
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center mb-6">Foydalanuvchilar</h1>

                {/* Search and Filter */}
                <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Foydalanuvchi qidirish..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => document.getElementById("filter-dropdown").classList.toggle("hidden")}
                            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm sm:text-base rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md"
                        >
                            <Filter size={16} /> Filter
                        </button>
                        <div
                            id="filter-dropdown"
                            className="hidden absolute right-0 mt-2 w-48 bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-lg shadow-xl border border-white/20 dark:border-gray-700/20 z-10"
                        >
                            {[
                                { id: "all", label: "Hammasi", icon: AlertCircle, count: users.length },
                                { id: "active", label: "Faol", icon: CheckCircle, count: users.filter((u) => u.status === "active").length },
                                { id: "inactive", label: "Nofaol", icon: XCircle, count: users.filter((u) => u.status === "inactive").length },
                                { id: "pending", label: "Kutilmoqda", icon: Clock, count: users.filter((u) => u.status === "pending").length },
                            ].map((filter) => (
                                <button
                                    key={filter.id}
                                    onClick={() => {
                                        setStatusFilter(filter.id);
                                        document.getElementById("filter-dropdown").classList.add("hidden");
                                    }}
                                    className={`w-full text-left px-3 py-2 text-xs sm:text-sm ${statusFilter === filter.id
                                        ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-700/80"
                                        }`}
                                >
                                    {filter.label} ({filter.count})
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Users Table/Cards */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 dark:border-gray-700/20">
                    <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                    {filteredUsers.length ? (
                        <div className="overflow-x-auto">
                            {/* Table for desktop */}
                            <table className="w-full text-left hidden sm:table">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                                        <th className="p-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">ID</th>
                                        <th className="p-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Ism</th>
                                        <th className="p-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                                        <th className="p-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Status</th>
                                        <th className="p-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Buyurtmalar</th>
                                        <th className="p-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Ro'yxatdan o'tgan</th>
                                        <th className="p-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Amallar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors"
                                        >
                                            <td className="p-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100">#{user.id}</td>
                                            <td className="p-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100">{user.fullName || "Noma'lum"}</td>
                                            <td className="p-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100">{user.email || "Noma'lum"}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(user.status)}`}>
                                                    {user.status === "active" ? "Faol" : user.status === "inactive" ? "Nofaol" : "Kutilmoqda"}
                                                </span>
                                            </td>
                                            <td className="p-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100">{user.orders?.total || 0}</td>
                                            <td className="p-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100">
                                                {user.registrationDate ? new Date(user.registrationDate).toLocaleDateString("uz-UZ") : "Noma'lum"}
                                            </td>
                                            <td className="p-3">
                                                <button
                                                    onClick={() => viewUserDetails(user)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-sm"
                                                >
                                                    <Eye size={14} /> Ko'rish
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Cards for mobile */}
                            <div className="sm:hidden divide-y divide-gray-100 dark:divide-gray-700">
                                {filteredUsers.map((user) => (
                                    <div key={user.id} className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">#{user.id} {user.fullName || "Noma'lum"}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">{user.email || "Noma'lum"}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">Buyurtmalar: {user.orders?.total || 0}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                                    Ro'yxatdan o'tgan: {user.registrationDate ? new Date(user.registrationDate).toLocaleDateString("uz-UZ") : "Noma'lum"}
                                                </p>
                                                <span className={`mt-1 inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeStyle(user.status)}`}>
                                                    {user.status === "active" ? "Faol" : user.status === "inactive" ? "Nofaol" : "Kutilmoqda"}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => viewUserDetails(user)}
                                                className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-sm flex items-center gap-1"
                                            >
                                                <Eye size={14} /> Ko'rish
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <User className="h-10 w-10 text-gray-400 mx-auto" />
                            <h3 className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Foydalanuvchilar topilmadi</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Boshqa parametrlar bilan qidirishni sinab ko'ring.</p>
                            <button
                                onClick={() => {
                                    setSearchTerm("");
                                    setStatusFilter("all");
                                }}
                                className="mt-3 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md"
                            >
                                Filterni tozalash
                            </button>
                        </div>
                    )}
                </div>

                {/* User Detail Modal */}
                {isModalOpen && selectedUser && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 dark:border-gray-700/20 w-full max-w-sm sm:max-w-lg m-4">
                            <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center justify-between mb-4 sm:mb-6">
                                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100">Foydalanuvchi ma'lumotlari</h2>
                                    <button
                                        onClick={() => setIsModalOpen(false)}
                                        className="p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Ism</p>
                                            <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">{selectedUser.fullName || "Noma'lum"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                            <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Telefon</p>
                                            <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">{selectedUser.phone || "Noma'lum"}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Ro'yxatdan o'tgan</p>
                                            <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
                                                {selectedUser.registrationDate ? new Date(selectedUser.registrationDate).toLocaleDateString("uz-UZ") : "Noma'lum"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                                            <Package className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 dark:text-amber-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Buyurtmalar</p>
                                            <p className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100">
                                                Jami: {selectedUser.orders?.total || 0}, Bajarilgan: {selectedUser.orders?.completed || 0}, Kutilmoqda: {selectedUser.orders?.pending || 0}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Users;