import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./pages/forHome/Navbar.jsx"
import HeroSection from "./pages/forHome/HeroSection.jsx"
import AboutUs from "./pages/forHome/AboutUs.jsx"
import Services from "./pages/forHome/Services.jsx"
import Advantages from "./pages/forHome/Advantages.jsx"
import Blog from "./pages/forHome/Blog.jsx"
import Testimonials from "./pages/forHome/Testimonials.jsx"
import SupportForm from "./pages/forHome/SupportForm.jsx"
import Footer from "./pages/forHome/Footer.jsx"
import "./App.css"
import Routers from "./Routers.jsx"
function App() {
    return (
        <BrowserRouter>
            <div className="app">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <>
                                <Navbar />
                                <main>
                                    <HeroSection />
                                    <AboutUs />
                                    <Services />
                                    <Advantages />
                                    <Blog />
                                    <Testimonials />
                                    <SupportForm />
                                </main>
                                <Footer />
                            </>
                        }
                    />
                    <Route path="/*" element={<Routers />} />
                </Routes>
            </div>
        </BrowserRouter>
    )
}

export default App
