import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileUp, Activity, User, Users, FileText, BarChart } from 'lucide-react';

const Sidebar = ({ role }) => {
  const customerLinks = [
    { name: 'Dashboard', path: '/customer/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Submit KYC', path: '/customer/submit', icon: <FileUp size={20} /> },
    { name: 'Track Status', path: '/customer/status', icon: <Activity size={20} /> },
    { name: 'Profile', path: '#', icon: <User size={20} /> },
  ];

  const officerLinks = [
    { name: 'Dashboard', path: '/officer/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Pending Review', path: '/officer/pending', icon: <FileText size={20} /> },
    { name: 'All Applications', path: '/officer/all', icon: <Users size={20} /> },
    { name: 'Reports', path: '#', icon: <BarChart size={20} /> },
  ];

  const links = role === 'OFFICER' ? officerLinks : customerLinks;

  return (
    <div className="w-64 bg-card-white h-[calc(100vh-4rem)] border-r border-gray-100 flex flex-col pt-6 sticky top-16 shadow-sm">
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-primary-blue text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-primary-blue'
              }`
            }
          >
            {link.icon}
            <span className="font-medium">{link.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 mt-auto border-t border-gray-100">
        <div className="bg-primary-blue/5 rounded-xl p-4 text-center">
          <p className="text-sm font-medium text-primary-blue mb-2">Need Help?</p>
          <button className="text-xs bg-white border border-primary-blue text-primary-blue w-full py-2 rounded-lg font-medium hover:bg-primary-blue hover:text-white transition">Contact Support</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
