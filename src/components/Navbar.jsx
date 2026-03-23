import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Bell, LogOut, User as UserIcon, UserCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-primary-blue text-white sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-xl font-bold flex items-center gap-2">
              <span className="bg-accent-gold p-1.5 rounded-lg text-primary-blue font-black">KYC</span>
              <span>Banking Portal</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-gray-200 hover:text-white relative">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-danger-red w-2.5 h-2.5 rounded-full"></span>
            </button>
            <div className="flex items-center gap-3 relative cursor-pointer" ref={menuRef} onClick={() => setShowProfileMenu(!showProfileMenu)}>
              <div className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition flex items-center justify-center">
                <UserIcon size={20} />
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium">{user?.fullName || 'User'}</div>
                <div className="text-xs text-blue-200 capitalize">{user?.role?.toLowerCase() || 'Customer'}</div>
              </div>
              
              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] py-2 border border-gray-100 z-50 transform origin-top-right transition-all text-gray-800">
                  <div className="px-4 py-2 border-b border-gray-50 mb-1">
                    <p className="text-sm font-bold text-gray-900 truncate">{user?.fullName || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{user?.email || 'user@example.com'}</p>
                  </div>
                  <Link 
                    to={user?.role === 'OFFICER' ? '/officer/dashboard' : '/customer/dashboard'} 
                    className="flex text-gray-700 hover:bg-gray-50 hover:text-primary-blue px-4 py-2.5 text-sm items-center gap-3 font-medium transition"
                  >
                    <UserCircle size={18} /> My Profile
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex w-full text-left text-danger-red hover:bg-red-50 px-4 py-2.5 text-sm items-center gap-3 font-medium transition"
                  >
                    <LogOut size={18} /> Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
