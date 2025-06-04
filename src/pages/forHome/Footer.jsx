import { Phone, Mail, MapPin } from "lucide-react"

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-orange-500">Dern-Support</h3>
            <p className="text-gray-300 leading-relaxed">
              Texnologiyadagi ishonchli hamkoringiz. Biz O'zbekiston bo'ylab biznes va jismoniy shaxslarga kompleks IT
              yechimlarni taqdim etamiz.
            </p>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Tez havolalar</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Bosh Sahifa
                </a>
              </li>
              <li>
                <a href="#about" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Biz haqimizda
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Xizmatlar
                </a>
              </li>
              <li>
                <a href="#blog" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Bog'lanish
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Bog'lanish uchun ma'lumot</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-500" />
                <span className="text-gray-300">+998 93 578 20 21</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-500" />
                <span className="text-gray-300">info@dern-support.uz</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-orange-500" />
                <span className="text-gray-300">Tashkent, Uzbekistan</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">&copy; 2025 Dern-Support. Barcha huquqlar himoyalangan.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
