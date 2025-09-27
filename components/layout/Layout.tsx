
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Player from './Player';


const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Mobile Header with Hamburger Menu */}
      <div className="md:hidden bg-gray-900 text-white p-4 flex items-center justify-between border-b border-gray-700">
        <button
          onClick={toggleMobileMenu}
          className="text-white hover:text-purple-400 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="text-xl font-bold text-purple-400">Campus Beats</div>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div className={`
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 transition-transform duration-300 ease-in-out
          fixed md:relative z-50 md:z-auto
          h-full md:h-auto
        `}>
          <Sidebar onMobileClose={() => setIsMobileMenuOpen(false)} />
        </div>
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        
        {/* Floating Autoplay Panel */}
  
      </div>
      <Player />
    </div>
  );
};

export default Layout;
