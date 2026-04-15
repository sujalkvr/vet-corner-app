// src/App.jsx - UPDATED WITH LOADING SCREEN
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Load from "./components/Load";
import Navbar from "./components/Navbar";
import NotificationBanner from "./components/NotificationBanner";
import Hero from "./components/Hero";
import Services from "./components/Services";
import ContactForm from "./components/ContactForm";
import Appointment from "./components/Appointment";
import Footer from "./components/Footer";
import About from "./components/About";
// import Reviews from './components/Reviews';
import BlogSection from "./components/BlogSection";
import BlogDetail from "./components/BlogDetail";
import AllBlogs from "./components/AllBlogs";
import SignIn from "./components/Admin/SignIn";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminStore from "./components/Admin/AdminStore";
import AdminStoreAuth from "./components/Admin/AdminStoreAuth";
import AdminTeam from "./components/Admin/AdminTeam";
import Store from "./components/Store";
import ProductsByCategory from "./components/ProductsByCategory";
import Payment from "./components/Payment";
import Animation from "./components/Animation";
import Faq from "./components/Faq";
import More from "./components/More";
import Team from "./components/Team";
import "./index.css";

const ScrollToSection = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return null;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showBanner, setShowBanner] = useState(true);

  return (
    <>
      {isLoading ? (
        <Load onLoadComplete={() => setIsLoading(false)} />
      ) : (
        <Router>
          <>
            <NotificationBanner show={showBanner} setShow={setShowBanner} />
            <Navbar showBanner={showBanner} />

            <div
              className={`min-h-screen bg-gradient-to-br from-emerald-50 to-white ${
                showBanner ? "pt-[92px]" : "pt-16"
              }`}
            >
              <ScrollToSection />

              <Routes>
                <Route
                  path="/"
                  element={
                    <>
                      <Hero />
                      <About />
                      <Services />
                      <Team />
                      <BlogSection />
                      <Store />
                      <Faq />
                      <ContactForm />
                      <Footer />
                    </>
                  }
                />

                <Route
                  path="/services"
                  element={
                    <>
                      <Services />
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/appointment"
                  element={
                    <>
                      <Appointment />
                      <Footer />
                    </>
                  }
                />
                <Route
                  path="/more"
                  element={
                    <>
                      <More />
                      <Footer />
                    </>
                  }
                />

                <Route path="/blog" element={<AllBlogs />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />

                <Route
                  path="/store/:category"
                  element={<ProductsByCategory />}
                />
                <Route path="/payment" element={<Payment />} />

                <Route path="/admin" element={<SignIn />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/store/auth" element={<AdminStoreAuth />} />
                <Route path="/admin/store" element={<AdminStore />} />
                <Route path="/admin/team" element={<AdminTeam />} />

                <Route
                  path="*"
                  element={
                    <>
                      <div className="min-h-screen flex items-center justify-center">
                        404
                      </div>
                      <Footer />
                    </>
                  }
                />
              </Routes>
            </div>
          </>
        </Router>
      )}
    </>
  );
}

export default App;
