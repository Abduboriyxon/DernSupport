import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Plus, RefreshCw, Edit, Trash2, X } from "lucide-react"
import axiosInstance from "../../../service/Axios"

const MasterQismlar = () => {
    const [parts, setParts] = useState([])
    const [search, setSearch] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [editPart, setEditPart] = useState(null)
    const [form, setForm] = useState({
        name: "",
        category: "",
        quantity: "",
        price: "",
        supplier: ""
    })

    // Fetch parts
    useEffect(() => {
        setIsLoading(true)
        axiosInstance
            .get("/parts", { params: { search } })
            .then(res => setParts(res.data.parts))
            .catch(() => setError("Qismlarni yuklashda xatolik"))
            .finally(() => setIsLoading(false))
    }, [search])

    // Add or Edit part
    const handleSave = async () => {
        if (!form.name || !form.category || !form.quantity || !form.price || !form.supplier) {
            setError("Barcha maydonlarni to'ldiring")
            return
        }
        setIsLoading(true)
        try {
            const data = {
                ...form,
                quantity: Number(form.quantity),
                price: Number(form.price)
            }
            if (editPart) {
                await axiosInstance.put(`/parts/${editPart._id}`, data)
            } else {
                await axiosInstance.post("/parts", data)
            }
            setShowModal(false)
            setEditPart(null)
            setForm({ name: "", category: "", quantity: "", price: "", supplier: "" })
            setError("")
            // Refresh
            const res = await axiosInstance.get("/parts", { params: { search } })
            setParts(res.data.parts)
        } catch {
            setError("Saqlashda xatolik")
        }
        setIsLoading(false)
    }

    // Delete part
    const handleDelete = async id => {
        setIsLoading(true)
        try {
            await axiosInstance.delete(`/parts/${id}`)
            setParts(parts.filter(p => p._id !== id))
        } catch {
            setError("O'chirishda xatolik")
        }
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
            <div className="max-w-7xl mx-auto">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 shadow-lg"
                    >
                        <div className="p-2 bg-red-500 rounded-full">
                            <X className="w-5 h-5 text-white" />
                        </div>
                        <p className="text-sm text-red-800 dark:text-red-200 flex-1">{error}</p>
                        <button
                            onClick={() => setError("")}
                            className="p-1 hover:bg-red-200 dark:hover:bg-red-800 rounded-full transition-colors"
                        >
                            <X size={16} className="text-red-600 dark:text-red-400" />
                        </button>
                    </motion.div>
                )}

                <div className="mb-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                            Extiyot qismlar
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            O'zingizning extiyot qismlaringizni professional tarzda boshqaring
                        </p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-xl border border-white/20 dark:border-gray-700/20"
                    >
                        <div className="flex flex-col lg:flex-row gap-4 items-center">
                            <div className="relative flex-1 max-w-md">
                                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Qism qidirish..."
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 font-medium"
                                onClick={() => { setShowModal(true); setEditPart(null); setForm({ name: "", category: "", quantity: "", price: "", supplier: "" }) }}
                                disabled={isLoading}
                            >
                                <Plus size={18} />
                                Yangi qism
                            </motion.button>
                        </div>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
                >
                    {isLoading ? (
                        <div className="flex justify-center py-10"><RefreshCw className="animate-spin" /></div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Nomi</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Kategoriya</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Miqdori</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Narxi</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Yetkazib beruvchi</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Amallar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    <AnimatePresence>
                                        {parts.length > 0 ? (
                                            parts.map((part) => (
                                                <motion.tr
                                                    key={part._id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: 20 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="hover:bg-blue-50/50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                                                >
                                                    <td className="px-6 py-4">{part.name}</td>
                                                    <td className="px-6 py-4">{part.category}</td>
                                                    <td className="px-6 py-4">{part.quantity}</td>
                                                    <td className="px-6 py-4">{part.price}</td>
                                                    <td className="px-6 py-4">{part.supplier}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors disabled:opacity-50"
                                                                onClick={() => { setShowModal(true); setEditPart(part); setForm(part) }}
                                                                disabled={isLoading}
                                                            >
                                                                <Edit size={16} />
                                                            </motion.button>
                                                            <motion.button
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                                                                onClick={() => handleDelete(part._id)}
                                                                disabled={isLoading}
                                                            >
                                                                <Trash2 size={16} />
                                                            </motion.button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))
                                        ) : (
                                            <motion.tr initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                                                <td colSpan={6} className="px-6 py-16 text-center text-gray-400">
                                                    Qismlar topilmadi
                                                </td>
                                            </motion.tr>
                                        )}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.div>

                {/* Modal */}
                <AnimatePresence>
                    {showModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 dark:border-gray-700"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{editPart ? "Qismni tahrirlash" : "Yangi qism qo'shish"}</h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                        disabled={isLoading}
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Qism nomi"
                                        required
                                        disabled={isLoading}
                                    />
                                    <input
                                        type="text"
                                        name="category"
                                        value={form.category}
                                        onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Kategoriya"
                                        required
                                        disabled={isLoading}
                                    />
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={form.quantity}
                                        onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Miqdori"
                                        min="0"
                                        required
                                        disabled={isLoading}
                                    />
                                    <input
                                        type="number"
                                        name="price"
                                        value={form.price}
                                        onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Narxi"
                                        min="0"
                                        required
                                        disabled={isLoading}
                                    />
                                    <input
                                        type="text"
                                        name="supplier"
                                        value={form.supplier}
                                        onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))}
                                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Yetkazib beruvchi"
                                        required
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium disabled:opacity-50"
                                        disabled={isLoading}
                                    >
                                        Bekor qilish
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSave}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                                        disabled={isLoading}
                                    >
                                        {isLoading && <RefreshCw size={16} className="animate-spin" />}
                                        Saqlash
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default MasterQismlar