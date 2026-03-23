import React, { useEffect, useState, useContext } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import { FileStack, FileCheck, FileWarning, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const response = await api.get('/customer/documents');
        const docs = response.data;
        setDocuments(docs);
        
        let pending = 0, approved = 0, rejected = 0;
        docs.forEach(doc => {
          if (doc.status === 'PENDING') pending++;
          if (doc.status === 'APPROVED') approved++;
          if (doc.status === 'REJECTED') rejected++;
        });
        
        setStats({ total: docs.length, pending, approved, rejected });
      } catch (error) {
        console.error('Error fetching documents', error);
      }
    };
    fetchDocs();
  }, []);

  const StatCard = ({ title, count, icon, colorClass }) => (
    <div className="card flex items-center justify-between border-b-4 border-transparent hover:border-primary-blue transition-all">
      <div>
        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{title}</h3>
        <p className={`text-3xl font-bold mt-2 ${colorClass}`}>{count}</p>
      </div>
      <div className={`p-4 rounded-xl ${colorClass.replace('text-', 'bg-').replace('blue-600', 'primary-blue/10').replace('orange-500', 'warning-orange/10').replace('green-500', 'success-green/10').replace('red-500', 'danger-red/10')}`}>
        {icon}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar role="CUSTOMER" />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.fullName}!</h1>
              <p className="text-gray-500 mt-1">Here is the overview of your KYC applications.</p>
            </div>
            <Link to="/customer/submit" className="btn-accent flex items-center gap-2">
              <FileStack size={18} /> Submit New KYC
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Submitted" count={stats.total} icon={<FileStack className="text-primary-blue" />} colorClass="text-blue-600" />
            <StatCard title="Pending Review" count={stats.pending} icon={<Clock className="text-warning-orange" />} colorClass="text-orange-500" />
            <StatCard title="Approved Docs" count={stats.approved} icon={<FileCheck className="text-success-green" />} colorClass="text-green-500" />
            <StatCard title="Rejected Docs" count={stats.rejected} icon={<FileWarning className="text-danger-red" />} colorClass="text-red-500" />
          </div>

          <div className="card">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Recent Submissions</h2>
            {documents.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <FileStack className="mx-auto text-gray-400 mb-3" size={40} />
                <p className="text-gray-600 mb-4">No KYC documents submitted yet.</p>
                <Link to="/customer/submit" className="text-primary-blue font-semibold hover:underline">Submit your first document</Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider border-b border-gray-100">
                      <th className="py-4 px-4 font-semibold rounded-tl-xl text-xs">Document Type</th>
                      <th className="py-4 px-4 font-semibold text-xs">Submitted On</th>
                      <th className="py-4 px-4 font-semibold text-xs">Status</th>
                      <th className="py-4 px-4 font-semibold rounded-tr-xl text-xs">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                        <td className="py-4 px-4 font-medium text-gray-800">{doc.documentType}</td>
                        <td className="py-4 px-4 text-sm text-gray-500">{new Date(doc.submittedAt).toLocaleDateString()}</td>
                        <td className="py-4 px-4">
                          <StatusBadge status={doc.status} />
                        </td>
                        <td className="py-4 px-4">
                          <Link to="/customer/status" className="text-primary-blue hover:text-blue-800 text-sm font-semibold transition">View Details</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;
