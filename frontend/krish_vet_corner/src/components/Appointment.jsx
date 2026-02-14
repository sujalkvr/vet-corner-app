import { useState } from 'react';
import { CalendarIcon, CameraIcon, CreditCardIcon, MailIcon, CheckCircleIcon, ChevronRightIcon } from 'lucide-react';
import {API_URL} from '../api';
const Appointment = () => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    personName: '',
    petName: '',
    email: '',
    phone: '',
    serviceType: '',
    description: '',
    date: '',
    altDate: '',
    paymentId: '',
    screenshot: null
  });
  const [preview, setPreview] = useState('');

  const serviceTypes = [
    'Vaccination', 'Consultation', 'Surgery', 'Grooming', 'Emergency', 'Checkup', 'Dental', 'Nutrition'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, screenshot: file });
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const formDataToSend = new FormData();
  Object.keys(formData).forEach(key => {
    if (key === 'screenshot' && formData[key]) {
      formDataToSend.append(key, formData[key]);
    } else if (formData[key]) {
      formDataToSend.append(key, formData[key]);
    }
  });

  try {
    const res = await fetch(`${API_URL}/api/appointment/book`, {
      method: 'POST',
      body: formDataToSend
    });

    const data = await res.json();
    
    if (data.success) {
      setShowSuccess(true);
      setFormData({
        personName: '', petName: '', email: '', phone: '',
        serviceType: '', description: '', date: '', altDate: '',
        paymentId: '', screenshot: null
      });
      setPreview('');
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert('Network error. Please try again.');
  } finally {
    setLoading(false);
  }
};


  return (
    <section className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-emerald-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Floating Decorations */}
      <div className="absolute top-32 right-16 w-64 h-64 bg-gradient-to-r from-emerald-300/30 to-teal-300/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-40 left-12 w-72 h-72 bg-gradient-to-r from-blue-300/20 to-purple-300/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="max-w-7xl mx-auto relative z-20">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl mb-4 leading-tight">
            Book Your Appointment
          </h1>
          <div className="max-w-2xl mx-auto">
            <h className="text-lg md:text-xl text-gray-700 font-light leading-relaxed">
              <b>
              how it works: Book Service Online → Consult with Vet→ Receive Advice/Digital Prescription → Follow-up 
              </b>
            </h>
          </div>
        </div>

        {/* Main Layout: LEFT QR + RIGHT FORM */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: QR + Instructions */}
          <div className="lg:sticky lg:top-20 space-y-6">
            {/* QR Section */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 lg:p-8 border border-emerald-200/60 hover:shadow-emerald-300/30 transition-all duration-500">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300">
                  <CreditCardIcon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Scan QR Code</h3>
                <p className="text-base text-emerald-700 font-semibold">Make payment & take screenshot</p>
              </div>
              
              {/* QR Image */}
              <div className="group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-lg border-4 border-dashed border-emerald-300/50 hover:border-emerald-400/70 transition-all duration-400 overflow-hidden">
                <img 
                  src="/images/qr.jpg" 
                  alt="Payment QR Code" 
                  className="w-48 h-48 mx-auto rounded-xl shadow-xl group-hover:scale-105 transition-transform duration-300 object-cover border-4 border-white/50"
                />
                <div className="absolute -top-8 -right-8 w-20 h-20 bg-emerald-400/20 rounded-2xl blur-xl group-hover:scale-110 transition-all duration-500" />
              </div>
            </div>

            {/* Step-by-Step Instructions */}
            <div className="space-y-3">
              <h4 className="text-xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent text-center">
                📋 How to Book
              </h4>
              {[
                '1. Scan QR code using UPI/Google Pay',
                '2. Complete payment based of the fee of your service',
                '3. Take screenshot of payment confirmation',
                '4. Fill all details carefully',
                '5. Upload payment proof & submit',
                '6. Receive email confirmation within 24 hours'
              ].map((step, idx) => (
                <div key={idx} className="group flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl hover:bg-emerald-50/60 hover:scale-[1.01] transition-all duration-400 border border-emerald-100/50 cursor-default">
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md font-bold text-white text-base group-hover:scale-110 transition-all duration-300">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800 leading-snug">{step}</p>
                  </div>
                  <ChevronRightIcon className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Booking Form */}
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 lg:p-8 border border-emerald-200/70 space-y-5">
              
              {/* Row 1: Names */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">👤 Your Full Name *</label>
                  <input
                    type="text"
                    name="personName"
                    value={formData.personName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/70 focus:outline-none transition-all duration-300 text-base bg-white/80 backdrop-blur-sm shadow-md hover:shadow-emerald-300/40 hover:border-emerald-400"
                    placeholder="Rahul tripathi"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">🐕 Pet Name *</label>
                  <input
                    type="text"
                    name="petName"
                    value={formData.petName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200/70 focus:outline-none transition-all duration-300 text-base bg-white/80 backdrop-blur-sm shadow-md hover:shadow-teal-300/40 hover:border-teal-400"
                    placeholder="Chintu"
                  />
                </div>
              </div>

              {/* Row 2: Contact */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">📧 Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200/70 focus:outline-none transition-all duration-300 text-base bg-white/80 backdrop-blur-sm shadow-md hover:shadow-blue-300/40 hover:border-blue-400"
                    placeholder="Rahul@gmail.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">📱 Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200/70 focus:outline-none transition-all duration-300 text-base bg-white/80 backdrop-blur-sm shadow-md hover:shadow-purple-300/40 hover:border-purple-400"
                    placeholder="+91 7338696563"
                  />
                </div>
              </div>

              {/* Row 3: Service + Date */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">🩺 Service Type *</label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/70 focus:outline-none transition-all duration-300 text-base bg-white/80 backdrop-blur-sm shadow-md hover:shadow-emerald-300/40 hover:border-emerald-400 appearance-none cursor-pointer"
                  >
                    <option value="">Choose Service</option>
                    {serviceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">📅 Preferred Date *</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200/70 focus:outline-none transition-all duration-300 text-base bg-white/80 backdrop-blur-sm shadow-md hover:shadow-teal-300/40 hover:border-teal-400 cursor-pointer"
                  />
                </div>
              </div>

              {/* Row 4: Alt Date */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">🔄 Alternate Date</label>
                <input
                  type="date"
                  name="altDate"
                  value={formData.altDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200/70 focus:outline-none transition-all duration-300 text-base bg-white/80 backdrop-blur-sm shadow-md hover:shadow-orange-300/40 hover:border-orange-400 cursor-pointer"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">📝 Pet Condition *</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200/70 focus:outline-none transition-all duration-300 resize-vertical text-base bg-white/80 backdrop-blur-sm shadow-md hover:shadow-purple-300/40 hover:border-purple-400"
                  placeholder="Describe symptoms, breed, age, etc..."
                />
              </div>

              {/* Payment Section */}
              <div className="space-y-4 p-5 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-2xl border-2 border-emerald-200/50">
                <h4 className="text-lg font-bold text-emerald-800 text-center mb-3">💳 Payment Verification</h4>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Transaction ID *</label>
                    <input
                      type="text"
                      name="paymentId"
                      value={formData.paymentId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200/70 focus:outline-none transition-all duration-300 text-base bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-orange-200/50 hover:border-orange-400"
                      placeholder="TXN123456789"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">📸 Payment Screenshot *</label>
                    <input
                      type="file"
                      name="screenshot"
                      onChange={handleFileChange}
                      required
                      accept="image/*"
                      className="w-full px-3 py-2.5 border-2 border-gray-200 rounded-2xl focus:border-red-500 focus:ring-2 focus:ring-red-200/70 focus:outline-none transition-all duration-300 text-sm bg-white/90 backdrop-blur-sm shadow-lg hover:shadow-red-200/50 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-gradient-to-r file:from-orange-500 file:to-red-500 file:text-white file:text-sm hover:file:from-orange-600 hover:file:to-red-600 cursor-pointer"
                    />
                  </div>
                </div>

                {preview && (
                  <div className="p-4 bg-orange-50/80 rounded-2xl border-2 border-dashed border-orange-200 shadow-md">
                    <p className="text-xs font-medium text-orange-800 mb-2 flex items-center">
                      <CameraIcon className="w-4 h-4 mr-2" />
                      Screenshot Preview ✓
                    </p>
                    <img src={preview} alt="Payment proof" className="w-full max-h-32 object-cover rounded-xl shadow-lg border-2 border-orange-100" />
                  </div>
                )}
              </div>

              {/* BOOK BUTTON */}
              <button
  type="submit"
  disabled={loading}
  className="w-full group relative px-8 py-4 disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 hover:from-emerald-600 hover:via-teal-600 hover:to-blue-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-[0_15px_30px_-10px_rgba(34,197,94,0.5)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-500 overflow-hidden transform-gpu disabled:shadow-md disabled:scale-100"
>
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <CalendarIcon className="w-6 h-6 group-hover:rotate-12 transition-all duration-500" />
                  <span>CONFIRM & BOOK APPOINTMENT</span>
                  <ChevronRightIcon className="w-5 h-5 group-hover:translate-x-2 transition-all duration-500" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 scale-[1.15] blur-xl -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[10000] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white/98 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden border-4 border-emerald-300/40 animate-scale-in">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl border-4 border-white/50">
                <CheckCircleIcon className="w-14 h-14 text-white animate-bounce" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                Booking Confirmed!
              </h2>
              <p className="text-xl text-emerald-800 font-bold mb-6 leading-relaxed">
                📅 Your appointment is secured!
              </p>
              <p className="text-base text-gray-700 mb-8 leading-relaxed max-w-sm mx-auto">
                Confirmation email sent. Check your inbox (and spam) within 24 hours. 
                <br/><strong className="text-emerald-700 block mt-2">Keep payment proof safe!</strong>
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-base rounded-2xl shadow-xl hover:shadow-emerald-500/60 hover:scale-105 transition-all duration-500 flex items-center justify-center mx-auto space-x-2 group"
              >
                <MailIcon className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                <span>Check Email & Close</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scale-in { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
        .animate-scale-in { animation: scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
      `}</style>
    </section>
  );
};

export default Appointment;