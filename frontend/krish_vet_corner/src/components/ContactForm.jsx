// src/components/Contact.jsx - FIXED FORMSPREE VERSION
import { useState, useRef } from 'react';
import { MapPin, Phone, Mail, Instagram, Youtube, Linkedin } from 'lucide-react';

const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const formRef = useRef();

  const socialLinks = [
    { icon: Instagram, href: 'https://instagram.com/krishvetcorner', color: 'from-pink-500 to-purple-500' },
    { icon: Youtube, href: 'https://youtube.com/@krishvetcorner', color: 'from-red-500 to-yellow-500' },
    { icon: Linkedin, href: 'https://www.linkedin.com/company/krish-vet-corner/', color: 'from-blue-500 to-blue-700' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus('');

    try {
      const formData = new FormData(formRef.current);
      const res = await fetch('https://formspree.io/f/mgoowwob', {  // Replace with your actual Formspree endpoint
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        setStatus('success');
        formRef.current.reset();
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50/30">
      {/* Floating Orbs */}
      {/* Floating Orbs */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-32 left-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl mb-6">
            Get In Touch
          </h2>
          <p className="text-xl sm:text-2xl text-gray-700 font-light max-w-3xl mx-auto leading-relaxed">
            Ready to give your pet the best care? Let's talk! 🐾
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* LEFT: Contact Info */}
          <div className="space-y-8 lg:sticky lg:top-24">
            <div className="text-center lg:text-left">
              <h3 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text drop-shadow-xl">
                Let's Connect!
              </h3>
              <p className="text-xl text-emerald-700/90 font-light leading-relaxed max-w-md mx-auto lg:mx-0">
                Reach out anytime. Your pet's health is our priority ❤️
              </p>
            </div>

            {/* Contact Cards */}
            <div className="space-y-6">
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="group flex items-start space-x-4 p-6 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-emerald-100/50">
                <MapPin className="w-12 h-12 text-emerald-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-xl text-gray-900 mb-2">Visit Us</h4>
                  <p className="text-gray-700 leading-relaxed">Koramangala 4rth block<br/>Bangalore 560095</p>
                </div>
              </a>

              <a href="tel:+48123456789" className="group flex items-start space-x-4 p-6 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-blue-100/50">
                <Phone className="w-12 h-12 text-blue-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-xl text-gray-900 mb-2">Call Us</h4>
                  <p className="text-gray-700 leading-relaxed">+91 7338612963</p>
                </div>
              </a>

              <a href="mailto:hello@krishvetcorner.com" className="group flex items-start space-x-4 p-6 bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-teal-100/50">
                <Mail className="w-12 h-12 text-teal-500 mt-1 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <div>
                  <h4 className="font-bold text-xl text-gray-900 mb-2">Email</h4>
                  <p className="text-gray-700 leading-relaxed">vetcorner2025@gmail.com</p>
                </div>
              </a>
            </div>

            {/* Social Icons */}
            <div className="pt-8 border-t border-gray-200">
              <h4 className="font-bold text-2xl text-gray-900 mb-8 text-center lg:text-left">Follow Us</h4>
              <div className="flex justify-center lg:justify-start space-x-6 pt-4">
                {socialLinks.map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-5 bg-white/60 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-400 border border-white/50 hover:border-transparent w-20 h-20 flex items-center justify-center"
                      aria-label={social.href}
                    >
                      <Icon className="w-9 h-9 text-gray-700 group-hover:text-white transition-all duration-300" />
                      <div className={`absolute inset-0 bg-gradient-to-r ${social.color} opacity-0 group-hover:opacity-100 rounded-3xl blur-sm -z-10 scale-[1.1] transition-all duration-500`} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div>
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 bg-white/90 backdrop-blur-2xl p-8 lg:p-12 rounded-3xl shadow-2xl border border-emerald-200/60">
              
              {/* Status Messages */}
              {status === 'success' && (
                <div className="p-8 bg-gradient-to-r from-emerald-100 to-teal-100 border-4 border-emerald-200 rounded-3xl text-center shadow-2xl animate-bounce">
                  <div className="text-4xl mb-4">🎉</div>
                  <h3 className="text-2xl font-black text-emerald-800 mb-3">Thank You!</h3>
                  <p className="text-emerald-700 font-semibold">Your message has been sent. We'll reply within 24 hours!</p>
                </div>
              )}

              {status === 'error' && (
                <div className="p-6 bg-red-50 border-2 border-red-200 rounded-2xl text-center shadow-lg">
                  <h3 className="text-xl font-bold text-red-800 mb-2">⚠️ Oops!</h3>
                  <p className="text-red-700">Something went wrong. Please try again.</p>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    className="w-full p-5 border-2 border-gray-200 rounded-3xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200/50 focus:outline-none transition-all duration-400 text-lg bg-white/60 backdrop-blur-sm shadow-xl hover:shadow-2xl hover:border-emerald-300"
                    placeholder="What's your name?"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">Phone</label>
                    <input
                      type="tel"
                      name="_phone"  // Formspree special field for phone
                      className="w-full p-5 border-2 border-gray-200 rounded-3xl focus:border-blue-400 focus:ring-4 focus:ring-blue-200/50 focus:outline-none transition-all duration-400 text-lg bg-white/60 backdrop-blur-sm shadow-xl hover:shadow-2xl"
                      placeholder="+91 7663563563"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full p-5 border-2 border-gray-200 rounded-3xl focus:border-teal-400 focus:ring-4 focus:ring-teal-200/50 focus:outline-none transition-all duration-400 text-lg bg-white/60 backdrop-blur-sm shadow-xl hover:shadow-2xl"
                      placeholder="petlover@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-3 ml-1">Tell us about your pet *</label>
                  <textarea
                    name="message"
                    rows="6"
                    required
                    className="w-full p-5 border-2 border-gray-200 rounded-3xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-200/50 focus:outline-none transition-all duration-400 resize-vertical text-lg bg-white/60 backdrop-blur-sm shadow-xl hover:shadow-2xl"
                    placeholder="Describe your pet's needs, symptoms, or questions..."
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full group relative p-6 lg:py-7 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white font-black text-xl lg:text-2xl rounded-3xl shadow-2xl hover:shadow-emerald-500/50 hover:scale-[1.02] transition-all duration-500 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center space-x-4"
              >
                <span className="relative z-10">
                  {loading ? '🕐 Sending...' : '🚀 Send Message'}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 scale-125 -skew-x-6 -translate-x-8 group-hover:translate-x-0 transition-all duration-700 blur-sm" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
