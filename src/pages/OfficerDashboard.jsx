import React, { useEffect, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import { Users, FileText, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const OfficerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const location = useLocation();
  const isAllDocs = location.pathname.includes('/all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await api.get('/officer/stats');
        setStats(statsRes.data);
        
        const docsRes = await api.get(isAllDocs ? '/officer/all' : '/officer/pending');
        setDocuments(docsRes.data);
      } catch (error) {
        console.error('Error fetching officer data', error);
      }
    };
    fetchData();
  }, [isAllDocs]);

  const chartData = [
    { name: 'Mon', apps: 4 },
    { name: 'Tue', apps: 7 },
    { name: 'Wed', apps: 5 },
    { name: 'Thu', apps: 12 },
    { name: 'Fri', apps: 9 },
    { name: 'Sat', apps: 3 },
    { name: 'Sun', apps: 6 },
  ];

  const filteredDocs = documents.filter(doc => 
    doc.customer?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    doc.documentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const StatCard = ({ title, count, icon, colorClass, bgClass }) => (
    <div className="card flex items-center p-6 border-l-4" style={{ borderColor: colorClass }}>
      <div className={`p-4 rounded-full mr-4 ${bgClass}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-sm font-medium uppercase">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{count}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar role="OFFICER" />
        <main className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Officer Dashboard</h1>
            <p className="text-gray-500 mt-1">Hello, {user?.fullName}. Here's your KYC review queue.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Assigned" count={stats.total} icon={<Users size={24} className="text-primary-blue" />} colorClass="#1A3C6E" bgClass="bg-blue-100" />
            <StatCard title="Pending Review" count={stats.pending} icon={<FileText size={24} className="text-warning-orange" />} colorClass="#FD7E14" bgClass="bg-orange-100" />
            <StatCard title="Approved" count={stats.approved} icon={<CheckCircle size={24} className="text-success-green" />} colorClass="#28A745" bgClass="bg-green-100" />
            <StatCard title="Rejected" count={stats.rejected} icon={<XCircle size={24} className="text-danger-red" />} colorClass="#DC3545" bgClass="bg-red-100" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2 card">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-gray-900">{isAllDocs ? 'All Applications' : 'Pending Review Queue'}</h2>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search customer..." 
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition">
                    <Filter size={18} />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold rounded-tl-lg">Applicant Name</th>
                      <th className="p-4 font-semibold">Document</th>
                      <th className="p-4 font-semibold">Date Submitted</th>
                      <th className="p-4 font-semibold text-center rounded-tr-lg">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredDocs.length > 0 ? filteredDocs.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50/50 transition">
                        <td className="p-4">
                          <div className="font-medium text-gray-900">{doc.customer?.fullName || 'Unknown'}</div>
                          <div className="text-xs text-gray-500">{doc.customer?.email}</div>
                        </td>
                        <td className="p-4 font-medium text-gray-700">{doc.documentType}</td>
                        <td className="p-4 text-sm text-gray-500">{new Date(doc.submittedAt).toLocaleDateString()}</td>
                        <td className="p-4 text-center">
                          {doc.status === 'PENDING' ? (
                            <Link to={`/officer/review/${doc.id}`} className="btn-primary text-xs px-3 py-1.5 inline-block">Review</Link>
                          ) : (
                            <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                              doc.status === 'APPROVED' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
                            }`}>
                              {doc.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan="4" className="p-8 text-center text-gray-500">No pending reviews found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Verification Activity</h2>
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1A3C6E" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#1A3C6E" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} textAnchor="end" tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                      cursor={{ fill: '#F3F4F6' }}
                    />
                    <Area type="monotone" dataKey="apps" stroke="#1A3C6E" strokeWidth={3} fillOpacity={1} fill="url(#colorApps)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OfficerDashboard;
