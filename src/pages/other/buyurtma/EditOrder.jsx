import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    AlertCircle,
    DollarSign,
    Calendar,
    Package,
    User,
    Phone,
    MapPin,
    Send,
    XCircle,
    RefreshCw,
} from "lucide-react";
import axiosInstance from "../../../service/Axios";

const EditOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [parts, setParts] = useState([]);
    const [formData, setFormData] = useState({
        price: "",
        completionTime: "",
        spareParts: [], // Array of { partId, quantity }
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch order and parts
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch order details
                const orderResponse = await axiosInstance.get(`/orders/${id}`);
                if (orderResponse.data.status !== "jarayonda") {
                    setError("Faqat jarayonda bo'lgan buyurtma tahrirlanadi");
                    setLoading(false);
                    return;
                }
                setOrder(orderResponse.data);

                // Fetch available parts
                const partsResponse = await axiosInstance.get("/parts");
                setParts(partsResponse.data.parts || []);
                setError(null);
            } catch (err) {
                setError(err.message || "Ma'lumotlarni yuklashda xatolik yuz berdi");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    // Calculate total parts cost
    const totalPartsCost = formData.spareParts.reduce((total, sp) => {
        const part = parts.find((p) => p._id === sp.partId);
        return total + (part ? part.price * sp.quantity : 0);
    }, 0);

    // Validate price against parts cost
    const isPriceValid = () => {
        if (!formData.price || totalPartsCost === 0) return true;
        const price = Number(formData.price);
        return price >= totalPartsCost;
    };

    // Handle spare part selection
    const handleAddSparePart = (partId) => {
        const part = parts.find((p) => p._id === partId);
        if (part && !formData.spareParts.find((sp) => sp.partId === partId)) {
            setFormData({
                ...formData,
                spareParts: [...formData.spareParts, { partId, quantity: 1 }],
            });
        }
    };

    // Handle quantity change
    const handleQuantityChange = (partId, quantity) => {
        const part = parts.find((p) => p._id === partId);
        if (!part) return;
        const newQuantity = Math.min(Math.max(1, Number(quantity)), part.quantity); // Ensure quantity is between 1 and available
        setFormData({
            ...formData,
            spareParts: formData.spareParts.map((sp) =>
                sp.partId === partId ? { ...sp, quantity: newQuantity } : sp
            ),
        });
    };

    // Remove spare part
    const handleRemoveSparePart = (partId) => {
        setFormData({
            ...formData,
            spareParts: formData.spareParts.filter((sp) => sp.partId !== partId),
        });
    };

    // Handle form submission
    const handleSubmit = useCallback(async () => {
        if (isSubmitting) return;
        if (!isPriceValid()) {
            setError(
                `Sizning ehtiyot qismlaringiz narxi ${totalPartsCost.toLocaleString()} so'm, siz ${formData.price} so'm kiritdingiz, siz bundayda bankrot bo'lasiz!`
            );
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);

            const payload = {};
            if (formData.price) payload.price = Number(formData.price);
            if (formData.completionTime) payload.completionTime = formData.completionTime;
            if (formData.spareParts.length > 0) payload.spareParts = formData.spareParts;

            const response = await axiosInstance.patch(`/orders/${id}/edit`, payload);

            if (response.status === 200) {
                navigate("/buyurtma/master", { state: { success: "Buyurtma muvaffaqiyatli tahrirlandi!" } });
            } else {
                setError(response.data.message || "Buyurtmani tahrirlashda xatolik");
            }
        } catch (err) {
            setError(err.message || "Buyurtmani tahrirlashda xatolik yuz berdi");
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, totalPartsCost, isSubmitting, id, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="w-20 h-20 border-4 border-blue-200 rounded-full animate-pulse"></div>
                        <RefreshCw className="h-10 w-10 animate-spin text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mt-4 font-medium">Ma'lumotlar yuklanmoqda...</p>
                </div>
            </div>
        );
    }

    if (!order || error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 flex items-center justify-center">
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 text-center">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Xatolik yuz berdi</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-1">{error || "Buyurtma topilmadi"}</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate("/buyurtma/master")}
                            className="flex items-center gap-2 mx-auto mt-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                        >
                            <span>Orqaga qaytish</span>
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
            <div className="max-w-4xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-gray-200 dark:border-gray-700"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Buyurtma #{order.id} ni tahrirlash</h2>
                        <button
                            onClick={() => navigate("/buyurtma/master")}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        >
                            <XCircle size={24} />
                        </button>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 p-4 bg-gradient-to-r from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 justify-between"
                        >
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-red-500 rounded-full">
                                    <AlertCircle className="w-5 h-5 text-white" />
                                </div>
                                <p className="text-sm text-red-800 dark:text-red-200 flex-1">{error}</p>
                            </div>
                            <button
                                onClick={() => setError(null)}
                                className="p-1 hover:bg-red-200 dark:hover:bg-red-800 rounded-full transition-colors duration-200"
                            >
                                <XCircle size={16} className="text-red-600 dark:text-red-400" />
                            </button>
                        </motion.div>
                    )}

                    {/* Order Details */}
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                    <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Mijoz</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{order.customerName || "Noma'lum"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Telefon</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{order.phone || "Noma'lum"}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Manzil</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{order.address || "Noma'lum"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Mahsulot ID</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{order.productId || "Noma'lum"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Edit Form */}
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Narx (so'm)
                                </label>
                                <div className="relative">
                                    <DollarSign size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="number"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Narxni kiriting"
                                        min="0"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Tugash sanasi
                                </label>
                                <div className="relative">
                                    <Calendar size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="date"
                                        value={formData.completionTime}
                                        onChange={(e) => setFormData({ ...formData, completionTime: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>

                            {/* Spare Parts Selection */}
                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Ehtiyot qismlar
                                </label>
                                <select
                                    onChange={(e) => handleAddSparePart(e.target.value)}
                                    className="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    disabled={isSubmitting || parts.length === 0}
                                >
                                    <option value="">Ehtiyot qism tanlang</option>
                                    {parts.map((part) => (
                                        <option key={part._id} value={part._id} disabled={formData.spareParts.find((sp) => sp.partId === part._id)}>
                                            {part.name} ({part.quantity} dona, {part.price.toLocaleString()} so'm)
                                        </option>
                                    ))}
                                </select>

                                {formData.spareParts.length > 0 && (
                                    <div className="mt-4 space-y-4">
                                        {formData.spareParts.map((sparePart) => {
                                            const part = parts.find((p) => p._id === sparePart.partId);
                                            return (
                                                <div key={sparePart.partId} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                                    <div className="flex-1">
                                                        <p className="font-semibold text-gray-900 dark:text-gray-100">{part?.name || "Noma'lum"}</p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">Narx: {part?.price.toLocaleString() || "0"} so'm / Dona</p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            max={part?.quantity || 1}
                                                            value={sparePart.quantity}
                                                            onChange={(e) => handleQuantityChange(sparePart.partId, e.target.value)}
                                                            className="w-20 p-2 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            disabled={isSubmitting}
                                                        />
                                                        <button
                                                            onClick={() => handleRemoveSparePart(sparePart.partId)}
                                                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all duration-200"
                                                            disabled={isSubmitting}
                                                        >
                                                            <XCircle size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-4">
                                            Ehtiyot qismlar jami narxi: {totalPartsCost.toLocaleString()} so'm
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Form Actions */}
                            <div className="flex gap-3 mt-6">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleSubmit}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 font-medium"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? <RefreshCw size={16} className="animate-spin" /> : <Send size={16} />}
                                    <span>Adminga yuborish</span>
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate("/buyurtma/master")}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium"
                                    disabled={isSubmitting}
                                >
                                    <XCircle size={16} />
                                    <span>Bekor qilish</span>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default EditOrder;