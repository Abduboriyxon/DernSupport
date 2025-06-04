function AboutUs() {
    return (
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://i.pinimg.com/736x/9a/e1/cd/9ae1cdea9ddf08b9c88e02d701ee5ff9.jpg"
                  alt="About Dern-Support"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-green-500 rounded-full opacity-20"></div>
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-orange-500 rounded-full opacity-20"></div>
            </div>
  
            <div className="space-y-8 order-1 lg:order-2">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">Biz kimmiz?</h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Dern-Support O'zbekiston bozorida faoliyat yurituvchi IT-texnik xizmat ko'rsatish kompaniyasi bo'lib,
                mijozlarimizga ishonchli, tezkor va moslashtirilgan texnik yechimlar taqdim etamiz. Maqsadimiz —
                biznesingizni barqaror va samarali texnik qo'llab-quvvatlash.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#advantages-section"
                  className="inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                >
                  Nima uchun biz?
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center border-2 border-gray-300 hover:border-orange-500 text-gray-700 hover:text-orange-500 px-8 py-4 text-lg rounded-xl transition-all duration-300 font-medium"
                >
                  Bog'lanish
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }
  
  export default AboutUs
  