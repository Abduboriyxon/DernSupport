import { Clock, Award, Shield, DollarSign } from "lucide-react"

function Advantages() {
  const advantages = [
    {
      title: "Tajriba",
      description: "Ko'p yillik tajribaga ega mutaxassislar",
      icon: <Award className="w-8 h-8" />,
      color: "bg-emerald-500",
    },
    {
      title: "Tezkor xizmat",
      description: "Tez javob va foydalanish imkoniyati",
      icon: <Clock className="w-8 h-8" />,
      color: "bg-rose-500",
    },
    {
      title: "Ishonchlilik",
      description: "Xizmat kafolati va doimiy yondashuv",
      icon: <Shield className="w-8 h-8" />,
      color: "bg-cyan-500",
    },
    {
      title: "Arzon narxlar",
      description: "Qulay va shaffof narxlash",
      icon: <DollarSign className="w-8 h-8" />,
      color: "bg-violet-500",
    },
  ]

  return (
    <section id="advantages-section" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nima uchun bizni tanlaysiz?</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Biz ushbu asosiy afzalliklarga ega bo'lgan ajoyib xizmatni taqdim etishdan faxrlanamiz
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="group hover:shadow-xl transition-all duration-300 bg-white rounded-xl shadow-lg hover:-translate-y-2 p-8 text-center"
            >
              <div
                className={`${advantage.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300`}
              >
                {advantage.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{advantage.title}</h3>
              <p className="text-gray-600 leading-relaxed">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Advantages
