import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Camera, Package, CheckCircle, ChevronRight, ShoppingCart, ArrowLeft } from 'lucide-react';
import { API_URL } from '../api';
const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    comments: '',
    paymentId: '',
    screenshot: null
  });
  const [preview, setPreview] = useState('');

  // Redirect if no product selected
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50/30">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Product Selected</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300"
          >
            Go to Store
          </button>
        </div>
      </div>
    );
  }

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
    
    // Add form fields
    Object.keys(formData).forEach(key => {
      if (key === 'screenshot' && formData[key]) {
        formDataToSend.append(key, formData[key]);
      } else if (formData[key]) {
        formDataToSend.append(key, formData[key]);
      }
    });

    // Add product details
    formDataToSend.append('productName', product.name);
    formDataToSend.append('productType', product.type);
    formDataToSend.append('productPrice', product.price);
    formDataToSend.append('productId', product._id);

    try {
      const res = await fetch(`${API_URL}/api/payment/order`, {
        method: 'POST',
        body: formDataToSend
      });

      const data = await res.json();
      
      if (data.success) {
        setShowSuccess(true);
        setFormData({
          name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
          comments: '', paymentId: '', screenshot: null
        });
        setPreview('');
      } else {
        alert(data.message || 'Order submission failed');
      }
    } catch (error) {
      alert('Network error. Please try again.');
      console.error('Payment error:', error);
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
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-800 hover:text-emerald-600 font-bold text-lg mb-8 transition-all duration-300 group"
        >
          <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="border-b-2 border-transparent group-hover:border-emerald-600 transition-all duration-300">
            Back to Products
          </span>
        </button>

        {/* Hero Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent drop-shadow-2xl mb-4 leading-tight">
            Complete Your Purchase
          </h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg md:text-xl text-gray-700 font-light leading-relaxed">
              Scan QR → Make Payment → Fill Details → Get Confirmation
            </p>
          </div>
        </div>

        {/* Main Layout: LEFT QR + RIGHT FORM */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* LEFT: Product Info + QR + Instructions */}
          <div className="lg:sticky lg:top-20 space-y-6">
            
            {/* Product Summary Card */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 border border-emerald-200/60 hover:shadow-emerald-300/30 transition-all duration-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <ShoppingCart className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
                  <p className="text-sm text-gray-600">Review your purchase</p>
                </div>
              </div>
              
              <div className="space-y-3 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border-2 border-gray-200/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Product:</span>
                  <span className="text-sm font-bold text-gray-900">{product.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-gray-700">Type:</span>
                  <span className="text-sm font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg">
                    {product.type}
                  </span>
                </div>
                <div className="border-t-2 border-dashed border-gray-300 my-3"></div>
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold text-gray-800">Total Amount:</span>
                  <span className="text-2xl font-black text-emerald-600 flex items-center">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* QR Section */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 lg:p-8 border border-emerald-200/60 hover:shadow-emerald-300/30 transition-all duration-500">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl hover:scale-110 transition-all duration-300">
                  <CreditCard className="w-8 h-8 text-white" />
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
                📋 Payment Steps
              </h4>
              {[
                '1. Scan QR code using UPI/Google Pay',
                `2. Pay ₹${product.price.toLocaleString('en-IN')} for ${product.name}`,
                '3. Take screenshot of payment confirmation',
                '4. Fill delivery & contact details',
                '5. Upload payment proof & submit',
                '6. Receive order confirmation via email'
              ].map((step, idx) => (
                <div key={idx} className="group flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-xl hover:bg-emerald-50/60 hover:scale-[1.01] transition-all duration-400 border border-emerald-100/50 cursor-default">
                  <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md font-bold text-white text-base group-hover:scale-110 transition-all duration-300">
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800 leading-snug">{step}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300 flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Payment Form */}
          <div className="space-y-6">
            <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 lg:p-8 border border-emerald-200/70 space-y-5">
              
              {/* Personal Details */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 pb-2 border-b-2 border-emerald-200">
                  👤 Personal Information
                </h3>
                
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/70 focus:outline-none transition-all duration-300 text-base bg-white/80 backdrop-blur-sm shadow-md hover:shadow-emerald-300/40 hover:border-emerald-400"
                    placeholder="Rahul Sharma"
                  />
                </div>

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
                      placeholder="rahul@gmail.com"
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
                      placeholder="+91 9876543210"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900 pb-2 border-b-2 border-teal-200">
                  📦 Delivery Address
                </h3>
                
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">Street Address *</label>
                  <textarea
                    name="address"
                    rows="2"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-teal-500 focus:ring-2 focus:ring-teal-200/70 focus:outline-none transition-all duration-300 resize-vertical text-base bg-white/80 backdrop-blur-sm shadow-md hover:shadow-teal-300/40 hover:border-teal-400"
                    placeholder="House no, Building, Street"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">🏙️ City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200/70 focus:outline-none transition-all duration-300 text-base bg-white/80 backdrop-blur-sm shadow-md hover:shadow-emerald-300/40 hover:border-emerald-400"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">🗺️ State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200/70 focus:outline-none transition-all duration-300 text-base bg-white/80 backdrop-blur-sm shadow-md hover:shadow-blue-300/40 hover:border-blue-400"
                      placeholder="Maharashtra"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">📮 Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                      pattern="[0-9]{6}"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200/70 focus:outline-none transition-all duration-300 text-base bg-white/80 backdrop-blur-sm shadow-md hover:shadow-purple-300/40 hover:border-purple-400"
                      placeholder="400001"
                    />
                  </div>
                </div>
              </div>

              {/* Additional Comments */}
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2 ml-1">💬 Additional Comments</label>
                <textarea
                  name="comments"
                  rows="2"
                  value={formData.comments}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200/70 focus:outline-none transition-all duration-300 resize-vertical text-base bg-white/80 backdrop-blur-sm shadow-md hover:shadow-orange-300/40 hover:border-orange-400"
                  placeholder="Special delivery instructions, gift message, etc..."
                />
              </div>

              {/* Payment Verification */}
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
                      <Camera className="w-4 h-4 mr-2" />
                      Screenshot Preview ✓
                    </p>
                    <img src={preview} alt="Payment proof" className="w-full max-h-32 object-cover rounded-xl shadow-lg border-2 border-orange-100" />
                  </div>
                )}
              </div>

              {/* SUBMIT BUTTON */}
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full group relative px-8 py-4 disabled:opacity-70 disabled:cursor-not-allowed bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 hover:from-emerald-600 hover:via-teal-600 hover:to-blue-600 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-[0_15px_30px_-10px_rgba(34,197,94,0.5)] hover:scale-[1.02] active:scale-[0.99] transition-all duration-500 overflow-hidden transform-gpu disabled:shadow-md disabled:scale-100"
              >
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <Package className="w-6 h-6 group-hover:rotate-12 transition-all duration-500" />
                  <span>{loading ? 'PROCESSING...' : 'CONFIRM ORDER & PAY'}</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-all duration-500" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-400 to-blue-400 scale-[1.15] blur-xl -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[10000] flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-white/98 backdrop-blur-2xl rounded-3xl shadow-2xl max-w-md w-full max-h-[85vh] overflow-hidden border-4 border-emerald-300/40 animate-scale-in">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-xl border-4 border-white/50">
                <CheckCircle className="w-14 h-14 text-white animate-bounce" />
              </div>
              <h2 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent mb-4 drop-shadow-lg">
                Order Confirmed!
              </h2>
              <p className="text-xl text-emerald-800 font-bold mb-6 leading-relaxed">
                🎉 Your purchase is confirmed!
              </p>
              <p className="text-base text-gray-700 mb-8 leading-relaxed max-w-sm mx-auto">
                Order confirmation sent to your email. We'll notify you once your order is shipped.
                <br/><strong className="text-emerald-700 block mt-2">Thank you for shopping!</strong>
              </p>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  navigate('/');
                }}
                className="w-full lg:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-base rounded-2xl shadow-xl hover:shadow-emerald-500/60 hover:scale-105 transition-all duration-500 flex items-center justify-center mx-auto space-x-2 group"
              >
                <ShoppingCart className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
                <span>Continue Shopping</span>
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

export default Payment;