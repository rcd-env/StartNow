import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  FileText,
  Compass,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './ui/AuthModals';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalType, setAuthModalType] = useState<'login' | 'signup'>('login');
  const { isLoggedIn, logout } = useAuth();

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Explore', href: '/explore', icon: Compass },
    { name: 'Submit Pitch', href: '/idea-input', icon: FileText },
  ];

  const isHomePage = location.pathname === '/';

  // State for sliding underline animation
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const navContainerRef = useRef<HTMLDivElement>(null);
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // Update underline position when route changes
  useEffect(() => {
    const updateUnderlinePosition = () => {
      const activeIndex = navigation.findIndex(item => item.href === location.pathname);
      if (activeIndex !== -1 && navItemRefs.current[activeIndex] && navContainerRef.current) {
        const activeElement = navItemRefs.current[activeIndex];
        const containerRect = navContainerRef.current.getBoundingClientRect();
        const activeRect = activeElement.getBoundingClientRect();

        setUnderlineStyle({
          left: activeRect.left - containerRect.left,
          width: activeRect.width,
        });
      }
    };

    // Small delay to ensure DOM is updated
    const timer = setTimeout(updateUnderlinePosition, 50);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-10 left-4 right-4 z-50">
        <div className="max-w-7xl mx-auto">
          {/* Navigation bar */}
          <div className="bg-gray-900/95 backdrop-blur-md rounded-3xl border border-gray-700/50 px-8 py-4 shadow-2xl shadow-black/20">
              <div className="flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex-shrink-0 group">
                  <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent hover:from-yellow-200 hover:via-yellow-100 hover:to-white transition-all duration-300">
                    StartNow
                  </h1>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-2 relative" ref={navContainerRef}>
                  {navigation.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        ref={(el) => { navItemRefs.current[index] = el; }}
                        to={item.href}
                        className={`${
                          isActive
                            ? 'text-white font-semibold'
                            : 'text-gray-300 hover:text-white hover:bg-gray-700/60'
                        } inline-flex items-center px-5 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg relative z-10`}
                      >
                        <Icon className="w-4 h-4 mr-2.5" />
                        <span className="font-display">{item.name}</span>
                      </Link>
                    );
                  })}
                  {/* Sliding underline */}
                  <div
                    className="absolute bottom-2 h-0.5 transition-all duration-700 ease-in-out z-0"
                    style={{
                      left: `${underlineStyle.left}px`,
                      width: `${underlineStyle.width}px`,
                      backgroundColor: '#ffee99',
                      transform: 'translateY(50%)',
                    }}
                  />
                </div>

                {/* Authentication and Connect Wallet Buttons */}
                <div className="hidden md:flex items-center space-x-2">
                  {!isLoggedIn ? (
                    <>
                      <button
                        onClick={() => {
                          setAuthModalType('login');
                          setAuthModalOpen(true);
                        }}
                        className="text-gray-300 hover:text-white hover:bg-gray-700/60 px-5 py-2.5 rounded-2xl text-sm font-medium font-display transition-all duration-300 hover:scale-105 border border-gray-600/50 hover:border-gray-500"
                      >
                        Log In
                      </button>
                      <button
                        onClick={() => {
                          setAuthModalType('signup');
                          setAuthModalOpen(true);
                        }}
                        className="text-gray-300 hover:text-white hover:bg-gray-700/60 px-5 py-2.5 rounded-2xl text-sm font-medium font-display transition-all duration-300 hover:scale-105 border border-gray-600/50 hover:border-gray-500"
                      >
                        Sign Up
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={logout}
                      className="text-gray-300 hover:text-red-400 hover:bg-red-900/20 px-5 py-2.5 rounded-2xl text-sm font-medium font-display transition-all duration-300 hover:scale-105 border border-gray-600/50 hover:border-red-500/50"
                    >
                      Log Out
                    </button>
                  )}

                  <button className="text-gray-900 font-bold font-display py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 hover:opacity-80" style={{ background: '#99a3a3' }}>
                    Connect Wallet
                  </button>
                </div>

                {/* Mobile menu button */}
                <div className="md:hidden flex items-center">
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-white hover:text-yellow-300 transition-all duration-300 p-3 rounded-2xl hover:bg-gray-700/60 hover:scale-105"
                  >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </div>
              </div>
            </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3">
            <div className="bg-gray-900/95 backdrop-blur-md rounded-3xl border border-gray-700/50 px-6 py-4 shadow-2xl shadow-black/20">
                <div className="space-y-2">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`${
                          isActive
                            ? 'text-white font-semibold border-l-4'
                            : 'text-gray-300 hover:bg-gray-700/60 hover:text-white'
                        } flex items-center px-5 py-3.5 rounded-r-2xl text-base font-medium font-display transition-all duration-300 hover:scale-105`}
                        style={isActive ? {borderLeftColor: '#ffee99'} : {}}
                      >
                        <Icon className="w-5 h-5 mr-3.5" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}

                  {/* Mobile Authentication Buttons */}
                  <div className="pt-4 border-t border-gray-700/50 mt-4 space-y-3">
                    {!isLoggedIn ? (
                      <>
                        <button
                          onClick={() => {
                            setAuthModalType('login');
                            setAuthModalOpen(true);
                            setMobileMenuOpen(false);
                          }}
                          className="w-full text-gray-300 hover:text-white hover:bg-gray-700/60 py-3.5 px-5 rounded-2xl text-base font-medium font-display transition-all duration-300 border border-gray-600/50 hover:border-gray-500"
                        >
                          Log In
                        </button>
                        <button
                          onClick={() => {
                            setAuthModalType('signup');
                            setAuthModalOpen(true);
                            setMobileMenuOpen(false);
                          }}
                          className="w-full text-gray-900 py-3.5 px-5 rounded-2xl text-base font-semibold font-display transition-all duration-300 shadow-lg hover:opacity-80"
                          style={{ background: '#ffee99' }}
                        >
                          Sign Up
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          logout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full text-gray-300 hover:text-red-400 hover:bg-red-900/20 py-3.5 px-5 rounded-2xl text-base font-medium font-display transition-all duration-300 border border-gray-600/50 hover:border-red-500/50"
                      >
                        Log Out
                      </button>
                    )}

                    <button className="w-full text-gray-900 font-bold font-display py-4 px-5 rounded-2xl transition-all duration-300 shadow-lg hover:opacity-80" style={{ background: '#fdc500' }}>
                      Connect Wallet
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </nav>

      {/* Main content */}
      <main className={isHomePage ? 'relative' : 'pt-24 min-h-screen bg-gray-900'}>
        {children}
      </main>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        type={authModalType}
        onSwitchType={(newType) => setAuthModalType(newType)}
      />
    </div>
  );
};

export default Layout;
