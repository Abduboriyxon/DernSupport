import { Star } from "lucide-react"

function Testimonials() {
  const testimonials = [
    {
      name: "Begzod Doniyorov",
      position: "Katta biznesmen",
      comment:
        "Dern-Support kompaniyasi butun ofis tarmog'imizni sozlash va ishga tushirish jarayonida katta yordam berdi. Ularning tezkor javob berishi va har qanday muammoni hal qilishdagi yondashuvi bizni doimo qoniqtirib kelmoqda.",
      rating: 5,
    },
    {
      name: "Diyora Tursunova",
      position: "Marketing mutaxassisi",
      comment:
        "Yirik taqdimot arafasida serverimiz nosozlikka uchraganida, Dern-Support jamoasi qisqa vaqt ichida tizimimizni tiklab, ish faoliyatimizni davom ettirish imkonini berdi. Ularning professional yondashuvi va tajribasi biznesimizni jiddiy yo‘qotishlardan asradi.",
      rating: 5,
    },
    {
      name: "Amir Alijonov",
      position: "IT mutaxassisi",
      comment:
        "Daromadim kompyuterim ishiga bog‘liq bo‘lgan inson sifatida, Dern-Support’ning masofaviy yordam xizmatidan foydalanish imkoniyati menga ishonch va xotirjamlik beradi. Ular dasturiy ta'minot muammolarida bir necha bor tez va samarali yordam ko‘rsatishdi.",
      rating: 4,
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Mijozlarimni fikrlari</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Faqat bizning so'zimizni qabul qilmang - mijozlarimiz nima deyishini tinglang
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-8"
            >
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.comment}"</p>
              <div className="border-t pt-4">
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-500">{testimonial.position}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
)
}

export default Testimonials
