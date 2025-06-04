import { useState } from "react";
import { updateMaster } from "../../../../service/masterService";
import { User, Mail, Phone, MapPin, Briefcase, X, CheckCircle } from "lucide-react";

const MasterView = ({ master, isOpen, onClose, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: master?.fullName || "",
        email: master?.email || "",
        phone: master?.phone || "",
        soha: master?.specialty || "",
        status: master?.status || "inactive",
        city: master?.address?.city || "",
        district: master?.address?.district || "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen || !master) return null;

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
        setSuccess("");
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const originalData = {
            name: master.fullName,
            email: master.email,
            phone: master.phone,
            soha: master.specialty,
            status: master.status,
            city: master.address?.city || "",
            district: master.address?.district || "",
        };
        const changedData = {};
        Object.keys(formData).forEach(key => {
            if (formData[key] !== originalData[key]) changedData[key] = formData[key];
        });

        if (!Object.keys(changedData).length) {
            setError("No changes made");
            return;
        }

        const masterData = {};
        if (changedData.name) masterData.name = changedData.name;
        if (changedData.email) masterData.email = changedData.email;
        if (changedData.phone) masterData.phone = changedData.phone;
        if (changedData.soha) masterData.soha = changedData.soha;
        if (changedData.status) masterData.status = changedData.status;
        if (changedData.city || changedData.district) {
            masterData.address = {
                city: changedData.city || originalData.city,
                district: changedData.district || originalData.district,
                street: master.address?.street || "",
            };
        }

        setIsLoading(true);
        try {
            await updateMaster(master.id, masterData);
            const updatedMaster = {
                ...master,
                fullName: masterData.name || master.fullName,
                email: masterData.email || master.email,
                phone: masterData.phone || master.phone,
                specialty: masterData.soha || master.specialty,
                status: masterData.status || master.status,
                address: masterData.address || master.address,
            };
            onUpdate(updatedMaster);
            setSuccess("Master updated successfully!");
            setIsEditing(false);
        } catch (err) {
            setError(`Failed to update: ${err.message}`);
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
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Master ma'lumotlari</h2>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                        >
                            <X size={20} />
                        </button>
                    </div>
                    {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}
                    {success && <div className="text-green-500 mb-4 text-sm">{success}</div>}

                    {isEditing ? (
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
                                    onClick={() => setIsEditing(false)}
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
                                    {isLoading ? "Saqlanmoqda..." : "Saqlash"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                    <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Ism</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{master.fullName || "Noma'lum"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{master.email || "Noma'lum"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Telefon</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{master.phone || "Noma'lum"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                                    <Briefcase className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Mutaxassislik</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{master.specialty || "Noma'lum"}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Holati</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                                        {master.status === "active" ? "Faol" : master.status === "inactive" ? "Nofaol" : "Band"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Manzil</p>
                                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                                        {master.address?.city || "Noma'lum"}, {master.address?.district || "Noma'lum"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsEditing(true)}
                                className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 shadow-sm"
                            >
                                Tahrirlash
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MasterView;