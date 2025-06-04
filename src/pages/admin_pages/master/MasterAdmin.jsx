import { useState, useEffect } from "react";
import { getAllMasters } from "../../../service/masterService";
import MasterView from "./components/MasterView";
import MasterAdd from "./components/MasterAdd";
import { Eye, Plus, RefreshCw, AlertCircle } from "lucide-react";

const MasterAdmin = () => {
    const [masters, setMasters] = useState([]);
    const [selectedMaster, setSelectedMaster] = useState(null);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMasters = async () => {
            setIsLoading(true);
            setError("");
            try {
                const response = await getAllMasters();
                const mastersData = Array.isArray(response.data.masters) ? response.data.masters : [];
                const formattedMasters = mastersData.map(master => ({
                    id: master._id,
                    fullName: master.name,
                    email: master.email || "",
                    phone: master.phone || "",
                    specialty: master.soha || "",
                    status: master.status || "inactive",
                    address: master.address || { city: "", district: "", street: "" },
                    jobs: master.jobs || { total: 0, completed: 0, inProgress: 0 },
                }));
                setMasters(formattedMasters);
            } catch (err) {
                setError("Masterlarni yuklashda xato: " + (err.message || "Noma'lum xato"));
            } finally {
                setIsLoading(false);
            }
        };
        fetchMasters();
    }, []);

    const handleUpdate = updatedMaster => {
        setMasters(masters.map(m => (m.id === updatedMaster.id ? updatedMaster : m)));
        setIsViewOpen(false);
    };

    const handleAdd = newMaster => {
        setMasters([...masters, newMaster]);
        setIsAddOpen(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto dark:text-blue-400" />
                    <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 font-medium">Masterlar yuklanmoqda...</p>
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
                <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Masterlar</h1>
                    <button
                        onClick={() => setIsAddOpen(true)}
                        className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm sm:text-base rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-md flex items-center gap-1"
                    >
                        <Plus size={16} /> Yangi Master
                    </button>
                </div>
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-xl shadow-xl border border-white/20 dark:border-gray-700/20">
                    <div className="h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                    {masters.length ? (
                        <div className="overflow-x-auto">
                            {/* Table for desktop */}
                            <table className="w-full text-left hidden sm:table">
                                <thead>
                                    <tr className="bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-100 dark:border-gray-700">
                                        <th className="p-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Ism</th>
                                        <th className="p-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                                        <th className="p-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Telefon</th>
                                        <th className="p-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Mutaxassislik</th>
                                        <th className="p-3 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">Amallar</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {masters.map(master => (
                                        <tr
                                            key={master.id}
                                            className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/50"
                                        >
                                            <td className="p-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100">{master.fullName || "Noma'lum"}</td>
                                            <td className="p-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100">{master.email || "Noma'lum"}</td>
                                            <td className="p-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100">{master.phone || "Noma'lum"}</td>
                                            <td className="p-3 text-xs sm:text-sm text-gray-900 dark:text-gray-100">{master.specialty || "Noma'lum"}</td>
                                            <td className="p-3">
                                                <button
                                                    onClick={() => {
                                                        setSelectedMaster(master);
                                                        setIsViewOpen(true);
                                                    }}
                                                    className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm rounded-lg hover:from-blue-700 hover:to-indigo-700 shadow-sm flex items-center gap-1"
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
                                {masters.map(master => (
                                    <div key={master.id} className="p-4 hover:bg-gray-50/50 dark:hover:bg-gray-700/50">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{master.fullName || "Noma'lum"}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">{master.email || "Noma'lum"}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">{master.phone || "Noma'lum"}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">{master.specialty || "Noma'lum"}</p>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedMaster(master);
                                                    setIsViewOpen(true);
                                                }}
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
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Masterlar topilmadi</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Yangi master qo'shing.</p>
                        </div>
                    )}
                </div>
                <MasterView
                    master={selectedMaster}
                    isOpen={isViewOpen}
                    onClose={() => setIsViewOpen(false)}
                    onUpdate={handleUpdate}
                />
                <MasterAdd isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} onAdd={handleAdd} />
            </div>
        </div>
    );
};

export default MasterAdmin;