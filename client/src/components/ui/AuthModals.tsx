import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'login' | 'signup';
  onSwitchType: (newType: 'login' | 'signup') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, type, onSwitchType }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const { login, signup } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'login') {
      login(formData.email, formData.password);
    } else {
      signup(formData.name, formData.email, formData.password);
    }
    onClose();
    setFormData({ name: '', email: '', password: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-gray-900/95 backdrop-blur-md rounded-3xl p-8 w-full max-w-md mx-4 border border-gray-700/50 shadow-2xl shadow-black/20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold font-display bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            {type === 'login' ? 'Log In' : 'Sign Up'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-all duration-300 p-2 rounded-xl hover:bg-gray-700/50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {type === 'signup' && (
            <div>
              <label htmlFor="name" className="block text-sm font-semibold font-display text-gray-300 mb-3">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-5 py-4 bg-gray-800/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-medium backdrop-blur-sm"
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-semibold font-display text-gray-300 mb-3">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-5 py-4 bg-gray-800/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-medium backdrop-blur-sm"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold font-display text-gray-300 mb-3">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-5 py-4 bg-gray-800/50 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 font-medium backdrop-blur-sm"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-300 hover:to-yellow-200 text-gray-900 font-bold font-display py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-yellow-500/30 mt-8"
          >
            {type === 'login' ? 'Log In' : 'Sign Up'}
          </button>
        </form>

        {/* Google Authentication Option for both Login and Signup */}
        <div className="mt-6 flex items-center">
          <div className="flex-1 border-t border-gray-600"></div>
          <span className="px-4 text-gray-400 text-sm font-display">or</span>
          <div className="flex-1 border-t border-gray-600"></div>
        </div>

        <button
          onClick={() => {
            // Handle Google authentication logic here
            console.log(`Google ${type} clicked`);
            onClose();
          }}
          className="w-full mt-4 bg-white hover:bg-gray-100 text-gray-900 font-semibold font-display py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 border border-gray-300 flex items-center justify-center space-x-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span>{type === 'login' ? 'Log in using Google' : 'Sign up using Google'}</span>
        </button>

        <div className="mt-8 text-center">
          <p className="text-gray-400 font-medium font-display">
            {type === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => onSwitchType(type === 'login' ? 'signup' : 'login')}
              className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors duration-300 underline hover:no-underline"
            >
              {type === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
