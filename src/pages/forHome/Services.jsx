import { Monitor, Cpu, Lightbulb } from "lucide-react"

function Services() {
  const services = [
    {
      title: "IT texnik yordami",
      description: "Masofadan va joyida muammolarni tezda hal qilish",
      icon: <Monitor className="w-8 h-8" />,
      color: "bg-emerald-500",
    },
    {
      title: "Qurilmani ta'mirlash",
      description: "Kompyuterlar, printerlar, routerlar va boshqa jihozlarni ta'mirlash",
      icon: <Cpu className="w-8 h-8" />,
      color: "bg-purple-500",
    },
    {
      title: "Raqamli va konsalting",
      description: "IT sohasida strategik maslahat va xavfsizlik yondashuvlari",
      icon: <Lightbulb className="w-8 h-8" />,
      color: "bg-amber-500",
    },
  ]

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Bizning xizmatlarimiz</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Biz sizning barcha texnologik ehtiyojlaringizni qondirish uchun keng qamrovli IT yechimlarni taqdim etamiz
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group hover:shadow-xl transition-all duration-300 bg-white rounded-xl shadow-lg p-8 text-center"
            >
              <div
                className={`${service.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white group-hover:scale-110 transition-transform duration-300`}
              >
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
