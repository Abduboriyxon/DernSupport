"use client"

import { useState } from "react"

function SupportForm() {
  const [formData, setFormData] = useState({
    personType: "Jismoniy",
    companyName: "",
    username: "",
    email: "",
    phone: "",
    os: "",
    orderName: "",
    specialist: "",
    deadline: "",
    city: "",
    district: "",
    street: "",
    problem: "",
  })
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const payload = {
      userType: formData.personType.toLowerCase(),
      companyName: formData.personType === "Yuridik" ? formData.companyName : undefined,
      name: formData.username,
      email: formData.email,
      phone: formData.phone,
      orderName: formData.orderName,
      specialist: formData.specialist,
      deadline: formData.deadline || undefined,
      city: formData.city,
      district: formData.district,
      street: formData.street,
      problem: `Muammo: ${formData.problem}\nOS: ${formData.os || "Noma'lum"}`,
    }

    try {
      // Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Ma'lumotingiz saqlandi")
      setFormData({
        personType: "Jismoniy",
        companyName: "",
        username: "",
        email: "",
        phone: "",
        os: "",
        orderName: "",
        specialist: "",
        deadline: "",
        city: "",
        district: "",
        street: "",
        problem: "",
      })
      setError("")
    } catch (error) {
      setError("Xatolik yuz berdi. Qayta urinib ko'ring.")
    }
  }

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="text-center p-8 pb-4">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Yordam kerakmi?</h2>
            <p className="text-lg text-gray-600">
              Quyidagi shaklni to'ldiring va bizning jamoamiz sizga imkon qadar tezroq javob beradi
            </p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="personType" className="block text-sm font-medium text-gray-700">
                    Shaxs turi
                  </label>
                  <select
                    id="personType"
                    name="personType"
                    value={formData.personType}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="Jismoniy">Jismoniy shaxs</option>
                    <option value="Yuridik">Yuridik shaxs</option>
                  </select>
                </div>

                {formData.personType === "Yuridik" && (
                  <div className="space-y-2">
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                      Kompaniya nomi
                    </label>
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="Kompaniya nomi"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    To'liq ismingiz
                  </label>
                  <input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="To'liq ismingiz"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Elektron pochta
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="pochta.nomi@gmail.com"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Telefon raqamingiz
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+998 XX XXX XX XX"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="os" className="block text-sm font-medium text-gray-700">
                    Qaysi qismda muammo bor? (ixtiyoriy)
                  </label>
                  <select
                    id="os"
                    name="os"
                    value={formData.os}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Tanlang</option>
                    <option value="software">Dasturiy qismi (Software)</option>
                    <option value="hardware">Qurilma qismi (Hardware)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="orderName" className="block text-sm font-medium text-gray-700">
                    Buyurtma nomi
                  </label>
                  <input
                    id="orderName"
                    name="orderName"
                    type="text"
                    value={formData.orderName}
                    onChange={handleChange}
                    placeholder="Buyurtma nomi"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
                    Qancha muddatda bajarilishi kerak?
                  </label>
                  <input
                    id="deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    Manzil: Shahar
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Shahar"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700">
                    Manzil: Tuman
                  </label>
                  <input
                    id="district"
                    name="district"
                    type="text"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="Tuman"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                    Manzil: Ko'cha
                  </label>
                  <input
                    id="street"
                    name="street"
                    type="text"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="Ko'cha"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="problem" className="block text-sm font-medium text-gray-700">
                  Muammoingizni tasvirlab bering
                </label>
                <textarea
                  id="problem"
                  name="problem"
                  value={formData.problem}
                  onChange={handleChange}
                  placeholder="Texnik muammo haqida batafsil yozing..."
                  rows={5}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
              >
                Yordam so'rovini yuborish
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default SupportForm
