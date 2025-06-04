function Blog() {
    const articles = [
      {
        title: "Kichik biznes egalari uchun kiberxavfsizlikning 10 muhim qoidasi",
description:
"Biznesingizni internetdagi firibgarlar va zararli hujumlardan himoya qilish uchun amal qilishingiz kerak bo‘lgan eng asosiy xavfsizlik tavsiyalari bilan tanishing.",
date: "May 10, 2025",
img: "https://media.gettyimages.com/id/1423067683/video/business-meeting-mentor-and-teamwork-with-intern-man-learning-and-training-data-analyst.jpg?s=640x640&k=20&c=46xUV9fP1vN-2Bo6W6r2qrvpYrsBuzShOuDWRSfPd40=",

      },
      {
        title: "Kompyuteringizni tezlashtirish va samaradorligini oshirishning oson usullari",
description: "Qimmat uskuna almashtirmasdan turib, kompyuteringiz ish faoliyatini oshirish uchun sinovdan o‘tgan va samarali uslublar bilan tanishing.",
date: "April 28, 2025",
img: "https://www.phoenixinternet.com/wp-content/uploads/2025/01/Untitled-22-1080x675.png",
      },
      {
        title: "O'zbekistonda masofaviy IT-xizmatlgitarning rivojlanish istiqbollari",
description: "O'zbekistonda IT-quvvatlash qanday rivojlanayotganini va bu zamonaviy biznes jarayonlariga qanday ta’sir ko‘rsatishini o‘rganing.",
date: "April 15, 2025",
img: "https://cdn.prod.website-files.com/636bbf9c519296f08f480299/65b2a142259bfd251449fc0e_blog%20-%20hero%20-%20when%20should%20you%20come%20to%20the%20office_.jpg",

      },
    ]
  
    return (
      <section id="blog" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Eng so'nggi maqolalar</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              IT olamidagi soʻnggi yangiliklarimiz va tushunchalarimizdan xabardor boʻling
            </p>
          </div>
  
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <div
                key={index}
                className="group hover:shadow-xl transition-all duration-300 bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={article.img || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-orange-500 font-medium mb-3">{article.date}</p>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{article.title}</h3>
                  <p className="text-gray-600 leading-relaxed line-clamp-3">{article.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  
  export default Blog
  