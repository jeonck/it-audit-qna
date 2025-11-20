import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleTitleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (location.pathname === '/') {
      window.location.reload();
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-white/90 backdrop-blur-lg shadow-soft-lg sticky top-0 z-50 border-b border-neutral-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex-shrink-0">
            <a href="/" onClick={handleTitleClick} className="text-2xl font-bold hover:opacity-80 transition-opacity flex items-center gap-2 group">
              <span className="text-3xl group-hover:scale-110 transition-transform">📋</span>
              <span>
                <span className="bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">정보시스템 감리</span>
                <span className="text-neutral-700"> Q&A</span>
              </span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/">💬 Q&A</NavLink>
            <NavLink to="/markdown-editor">📝 마크다운 에디터</NavLink>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-neutral-700 hover:bg-primary-50 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
              aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
              aria-expanded={isOpen}
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-neutral-200 animate-slide-down">
          <div className="px-4 pt-2 pb-4 space-y-2">
            <MobileNavLink to="/" onClick={() => setIsOpen(false)}>💬 Q&A</MobileNavLink>
            <MobileNavLink to="/markdown-editor" onClick={() => setIsOpen(false)}>📝 마크다운 에디터</MobileNavLink>
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-xl text-base font-medium transition-all duration-200 ${
        isActive
          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
          : 'text-neutral-700 hover:text-primary-600 hover:bg-primary-50'
      }`}
    >
      {children}
    </Link>
  );
};

const MobileNavLink = ({ to, children, onClick }: { to: string; children: React.ReactNode; onClick: () => void }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
        isActive
          ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md'
          : 'text-neutral-800 hover:bg-primary-50 hover:text-primary-600'
      }`}
    >
      {children}
    </Link>
  );
};

export default Navbar;
