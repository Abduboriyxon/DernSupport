function HeroSection() {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                IT muammolaringizga tezkor yechim
                <span className="text-orange-500">🔥</span>
              </h1>
              <h4 className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                Texnik yordam, qurilmalarni ta'mirlash va raqamli maslahat -
                <span className="italic underline font-medium"> barchasi bir joyda!</span>
              </h4>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#services"
                  className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                >
                  Xizmatlarimiz bilan tanishing
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center border-2 border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-500 px-8 py-4 text-lg rounded-xl transition-all duration-300 font-medium"
                >
                  So'rov yuborish
                </a>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://i.pinimg.com/736x/39/04/ca/3904cac800f334f51befce656d85b7e0.jpg"
                  alt="IT Support Services"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-orange-500 rounded-full opacity-20"></div>
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-green-500 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  export default HeroSection
  