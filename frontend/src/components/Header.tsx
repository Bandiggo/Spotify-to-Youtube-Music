import React from 'react';
import { Navbar, NavbarContent, NavbarItem } from '@heroui/react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <Navbar 
      className="bg-gradient-to-r from-black to-gray-900 border-b border-gray-800 pl-0"
      maxWidth="full"
      shouldHideOnScroll
    >
      <NavbarContent className="gap-4 justify-start pl-2 sm:pl-4">
        <NavbarItem>
          <div 
            className="relative" 
            onMouseEnter={(e) => e.currentTarget.classList.add('hovered')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('hovered')}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-green-400/10 rounded-lg opacity-0 blur-md transition-opacity duration-300 -z-10 hovered-glow"></div>
            <div className="absolute inset-0 opacity-[0.03] 
              bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=')]
              rounded-lg -z-5"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-white/5 to-emerald-500/5 rounded-lg -z-10"></div>
            <Link to="/">
              <button 
                className="px-4 py-2 text-gray-400 
                  bg-white/5 backdrop-blur-sm rounded-lg border border-white/10
                  hover:text-white hover:bg-white/10 
                  transition-all duration-300
                  shadow-sm"
              >
                Home
              </button>
            </Link>
          </div>
        </NavbarItem>
        
        <NavbarItem>
          <div 
            className="relative" 
            onMouseEnter={(e) => e.currentTarget.classList.add('hovered')}
            onMouseLeave={(e) => e.currentTarget.classList.remove('hovered')}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/10 to-green-400/10 rounded-lg opacity-0 blur-md transition-opacity duration-300 -z-10 hovered-glow"></div>
            <div className="absolute inset-0 opacity-[0.03] 
              bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iLjA1IiBkPSJNMCAwaDMwMHYzMDBIMHoiLz48L3N2Zz4=')]
              rounded-lg -z-5"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-white/5 to-emerald-500/5 rounded-lg -z-10"></div>
            <Link to="/convert">
              <button 
                className="px-4 py-2 text-gray-400 
                  bg-white/5 backdrop-blur-sm rounded-lg border border-white/10
                  hover:text-white hover:bg-white/10 
                  transition-all duration-300
                  shadow-sm"
              >
                Convert
              </button>
            </Link>
          </div>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default Header;