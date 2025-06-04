import { useState } from "react";
import { createMaster } from "../../../../service/masterService";
import { User, Mail, Phone, MapPin, Briefcase, X, CheckCircle } from "lucide-react";

const MasterAdd = ({ isOpen, onClose, onAdd }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        soha: "",
        status: "inactive",
        city: "",
        district: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
        setSuccess("");
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const masterData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            soha: formData.soha,
            status: formData.status,
            address: { city: formData.city, district: formData.district, street: "" },
        };

        // Minimal validation: ensure at least one field is filled
        if (!Object.values(masterData).some(val => val) && !masterData.address.city && !masterData.address.district) {
            setError("Kamida bitta maydon to'ldirilishi kerak");
            return;
        }

        setIsLoading(true);
        try {
            const response = await createMaster(masterData);
            const newMaster = {
                id: response.data?.id || Date.now().toString(), // Fallback ID if backend doesn't return one
                fullName: masterData.name,
                email: masterData.email,
                phone: masterData.phone,
                specialty: masterData.soha,
                status: masterData.status,
                address: masterData.address,
                jobs: { total: 0, completed: 0, inProgress: 0 },
            };
            onAdd(newMaster);
            setSuccess("Master muvaffaqiyatli qo'shildi!");
            setFormData({ name: "", email: "", phone: "", soha: "", status: "inactive", city: "", district: "" });
        } catch (err) {
            setError(`Qo'shishda xato: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 w-full max-w-md m-4">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Yangi Master qo'shish</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
                    {success && <div className="text-green-500 mb-4 text-sm">{success}</div>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Ism"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Telefon"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <select
                            name="soha"
                            value={formData.soha}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Mutaxassislik tanlang</option>
                            <option value="Dasturiy ta'minot mutahasisi">Dasturiy ta'minot mutahasisi</option>
                            <option value="Kompyuter ustasi">Kompyuter ustasi</option>
                        </select>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="inactive">Nofaol</option>
                            <option value="active">Faol</option>
                            <option value="busy">Band</option>
                        </select>
                        <input
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            placeholder="Shahar"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                            name="district"
                            value={formData.district}
                            onChange={handleChange}
                            placeholder="Tuman"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 px-4 py-3 bg-gray-500 text-white rounded-xl hover:bg-gray-600 shadow-sm"
                                disabled={isLoading}
                            >
                                Bekor qilish
                            </button>
                            <button
                                type="submit"
                                className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-sm"
                                disabled={isLoading}
                            >
                                {isLoading ? "Saqlanmoqda..." : "Qo'shish"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default MasterAdd;