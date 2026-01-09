// src/components/Footer.jsx
const Footer = () => (
  <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-t from-gray-900 to-gray-800 text-white">
    <div className="max-w-7xl mx-auto text-center">
      <h3 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text mb-6">
        Krish Vet Corner
      </h3>
      <p className="text-xl text-gray-300 mb-8 max-w-md mx-auto">
        Professional veterinary care with love & compassion
      </p>
      <div className="flex flex-wrap justify-center space-x-6 mb-8 text-2xl">
        <a href="#contact" className="hover:text-emerald-400 transition-colors">📞 Contact</a>
        <a href="#services" className="hover:text-emerald-400 transition-colors">🩺 Services</a>
        <a href="/appointment" className="hover:text-emerald-400 transition-colors">📅 Book</a>
      </div>
      <div className="border-t border-gray-700 pt-8 text-sm text-gray-400">
        © 2026 Krish Vet Corner. All rights reserved. Warsaw, Poland.
      </div>
    </div>
  </footer>
);
export default Footer;