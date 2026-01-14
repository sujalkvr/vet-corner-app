import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShoppingBag, ArrowLeft } from 'lucide-react';

const AdminStoreAuth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/admin/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('storeAuthToken', data.token);
        navigate('/admin/store');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="mb-6 flex items-center gap-2 text-violet-700 hover:text-violet-900 font-semibold transition-all"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>

        {/* Auth Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-violet-200">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full mb-4 shadow-lg">
              <ShoppingBag className="text-white" size={40} />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Store Access
            </h2>
            <p className="text-gray-600 mt-2">Enter admin credentials to continue</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-100 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
              <span className="font-semibold">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold mb-2 text-gray-700 flex items-center">
                <Mail className="mr-2 text-violet-600" size={18} />
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-all"
                placeholder="admin@example.com"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-gray-700 flex items-center">
                <Lock className="mr-2 text-violet-600" size={18} />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-violet-500 focus:outline-none transition-all"
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-500 via-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              <Lock size={20} />
              <span>{loading ? 'Verifying...' : 'Access Store'}</span>
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 p-4 bg-violet-50 rounded-xl border-2 border-violet-200">
            <p className="text-sm text-violet-800 text-center">
              🔒 <strong>Secure Area:</strong> Admin authentication required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStoreAuth;