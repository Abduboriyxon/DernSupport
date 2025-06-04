import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { User, Mail, Calendar, Edit, Key, X, Save, Loader } from "lucide-react"
import { getProfile, updateProfile } from "../../service/profileService"

const avatarOptions = [
    "https://cdn-icons-png.flaticon.com/128/149/149071.png",
    "https://cdn-icons-png.flaticon.com/128/924/924874.png",
    "https://cdn-icons-png.flaticon.com/128/4140/4140039.png",
    "https://cdn-icons-png.flaticon.com/128/4140/4140061.png",
    "https://cdn-icons-png.flaticon.com/128/4333/4333609.png",
    "https://cdn-icons-png.flaticon.com/128/1154/1154448.png",
    "https://cdn-icons-png.flaticon.com/128/16683/16683419.png",
    "https://cdn-icons-png.flaticon.com/128/1177/1177568.png",
    "https://cdn-icons-png.flaticon.com/128/6997/6997674.png",
]

function Profile() {
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        login: "",
        avatar: avatarOptions[0],
    })

    useEffect(() => {
        setLoading(true)
        getProfile()
            .then(data => {
                const user = data?.user || {}
                setProfile(user)
                setFormData({
                    name: user.name || "",
                    login: user.login || "",
                    avatar: user.avatar || avatarOptions[0],
                })
            })
            .catch(() => setError("Profil ma'lumotlarini yuklashda xatolik"))
            .finally(() => setLoading(false))
    }, [])

    const handleInputChange = e => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleAvatarChange = avatarUrl => {
        setFormData(prev => ({ ...prev, avatar: avatarUrl }))
    }

    const handleProfileUpdate = async e => {
        e.preventDefault()
        setError("")
        setLoading(true)
        try {
            const response = await updateProfile(formData)
            if (response.status === "success") {
                setProfile(response.user)
                setIsEditing(false)
                window.location.reload()
            } else {
                setError(response.message || "Profilni yangilashda xatolik")
            }
        } catch {
            setError("Profilni yangilashda xatolik")
        }
        setLoading(false)
    }

    if (loading && !profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-lg bg-white/80 dark:bg-gray-800/80 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden"
            >
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="mx-6 mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-2"
                        >
                            <X size={18} className="text-red-600" />
                            <span className="text-red-700 dark:text-red-300">{error}</span>
                        </motion.div>
                    )}
                </AnimatePresence>
                <div className="relative">
                    <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />
                    <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16">
                        <img
                            src={profile?.avatar || avatarOptions[0]}
                            alt="Profile Avatar"
                            className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
                        />
                    </div>
                </div>
                <div className="pt-20 pb-8 px-6">
                    {isEditing ? (
                        <form onSubmit={handleProfileUpdate} className="space-y-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 text-center">
                                Profilni tahrirlash
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Avatar tanlang
                                </label>
                                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                    {avatarOptions.map((avatarUrl) => (
                                        <div
                                            key={avatarUrl}
                                            onClick={() => handleAvatarChange(avatarUrl)}
                                            className={`cursor-pointer rounded-full p-1 ${formData.avatar === avatarUrl
                                                ? "ring-2 ring-blue-500 bg-blue-50"
                                                : "hover:bg-gray-100"
                                                }`}
                                        >
                                            <img
                                                src={avatarUrl}
                                                alt="Avatar Option"
                                                className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                    To'liq ism
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-1">
                                    Login
                                </label>
                                <input
                                    type="text"
                                    id="login"
                                    name="login"
                                    value={formData.login}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 border border-gray-600 rounded-xl text-gray-600 hover:bg-gray-100"
                                >
                                    Bekor qilish
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center disabled:opacity-50"
                                >
                                    {loading ? (
                                        <Loader className="w-4 h-4 animate-spin mr-2" />
                                    ) : (
                                        <Save className="w-4 h-4 mr-2" />
                                    )}
                                    Saqlash
                                </button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{profile?.name}</h2>
                                <p className="text-gray-600 dark:text-gray-400 mt-1 capitalize">
                                    {profile?.role || "Foydalanuvchi"}
                                </p>
                            </div>
                            <div className="mt-6 space-y-4">
                                <div className="flex items-center p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl border border-gray-200">
                                    <Mail className="w-5 h-5 text-gray-500 mr-3" />
                                    <div className="flex-1">
                                        <span className="text-sm font-medium text-gray-500">Email:</span>
                                        <span className="text-sm text-gray-800 ml-2">
                                            {profile?.email || "Noma'lum"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl border border-gray-100">
                                    <User className="w-5 h-5 text-gray-500 mr-3" />
                                    <div className="flex-1">
                                        <span className="text-sm font-medium text-gray-500">Login:</span>
                                        <span className="text-sm text-gray-800 ml-2">
                                            {profile?.login || "Noma'lum"}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center p-4 bg-white/50 dark:bg-gray-700/50 rounded-xl border border-gray-100">
                                    <Calendar className="w-5 h-5 text-gray-500 mr-3" />
                                    <div className="flex-1">
                                        <span className="text-sm font-medium text-gray-500">A'zo bo'lgan:</span>
                                        <span className="text-sm text-gray-800 ml-2">
                                            {profile?.createdAt
                                                ? new Date(profile.createdAt).toLocaleDateString("uz-UZ", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })
                                                : "Noma'lum"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-8">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setIsEditing(true)}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 flex items-center justify-center"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Profilni tahrirlash
                                </motion.button>
                            </div>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    )
}

export default Profile