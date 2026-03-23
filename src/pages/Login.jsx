import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const user = await login(email, password);
      if (user.role === 'OFFICER') {
        navigate('/officer/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err) {
      if (err.response?.data) {
        if (err.response.data.error) {
          setError(err.response.data.error);
        } else if (typeof err.response.data === 'object') {
          const msgs = Object.values(err.response.data).join(', ');
          setError(msgs || 'Invalid email or password');
        } else {
          setError('Invalid email or password');
        }
      } else {
        setError('Login failed. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary-blue/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] relative z-10 border border-gray-100">
        <div>
          <div className="mx-auto w-16 h-16 bg-primary-blue rounded-2xl flex items-center justify-center shadow-lg transform -rotate-6">
            <ShieldCheck className="text-accent-gold" size={36} />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Secure Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Banking KYC Process Automation System
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-danger-red/10 border-l-4 border-danger-red text-danger-red p-4 rounded-md text-sm font-medium">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-xl relative block w-full pl-10 px-3 py-3 border border-gray-200 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary-blue hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue transition shadow-md ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Authenticating...' : 'Sign in'}
            </button>
          </div>
          
          <div className="text-center text-sm font-medium">
            <span className="text-gray-500">Don't have an account? </span>
            <Link to="/register" className="text-primary-blue hover:text-blue-800 transition">
              Register here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
