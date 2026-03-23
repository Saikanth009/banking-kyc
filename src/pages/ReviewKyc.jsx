import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../api/axiosConfig';
import { ArrowLeft, CheckCircle, XCircle, FileText, User, Mail, Calendar } from 'lucide-react';

const ReviewKyc = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const response = await api.get('/officer/all');
        const doc = response.data.find(d => d.id.toString() === id);
        if (doc) setDocument(doc);
        else setError('Document not found');
      } catch (err) {
        setError('Failed to load document');
      } finally {
        setLoading(false);
      }
    };
    fetchDoc();
  }, [id]);

  const handleAction = async (action) => {
    if (action === 'REJECTED' && !remarks) {
      setError('Remarks are required for rejection');
      return;
    }
    
    setActionLoading(true);
    setError('');
    
    try {
      if (action === 'APPROVED') {
        await api.put(`/officer/approve/${id}`);
      } else {
        await api.put(`/officer/reject/${id}`, { status: 'REJECTED', remarks });
      }
      navigate('/officer/dashboard');
    } catch (err) {
      setError(`Failed to ${action.toLowerCase()} document`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  if (!document) return <div className="min-h-screen bg-background flex items-center justify-center font-bold text-danger-red">{error}</div>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar role="OFFICER" />
        <main className="flex-1 p-8">
          <div className="mb-6 flex animate-in slide-in-from-left-4">
            <button 
              onClick={() => navigate('/officer/dashboard')}
              className="flex items-center gap-2 text-gray-500 hover:text-primary-blue transition font-medium"
            >
              <ArrowLeft size={18} /> Back to Dashboard
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
            {/* Left Panel: Document Preview */}
            <div className="lg:col-span-2 card flex flex-col h-[800px]">
              <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="text-primary-blue" /> Document Preview
                </h2>
                <div className="bg-gray-100 px-3 py-1 rounded-lg text-sm font-medium text-gray-700">
                  {document.documentType}
                </div>
              </div>
              <div className="flex-1 bg-gray-100 rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center relative">
                {/* Simulated PDF/Image viewer */}
                <img 
                  src={`http://localhost:8080${document.filePath}`}
                  alt="KYC Document"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.parentElement.innerHTML = '<div class="text-center p-8"><FileText size={48} class="mx-auto text-gray-400 mb-4"/><p class="text-gray-500">Document viewer unavailable.<br/>File path: ' + document.filePath + '</p></div>';
                  }}
                />
              </div>
            </div>

            {/* Right Panel: Information & Actions */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="font-bold text-gray-900 border-b border-gray-100 pb-3 mb-4 flex items-center gap-2">
                  <User size={18} className="text-gray-400" /> Applicant Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Full Name</p>
                    <p className="font-medium text-gray-900 text-lg">{document.customer?.fullName}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg"><Mail size={16} className="text-gray-500" /></div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Email Address</p>
                      <p className="font-medium text-gray-800 text-sm">{document.customer?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-lg"><Calendar size={16} className="text-gray-500" /></div>
                    <div>
                      <p className="text-xs text-gray-500 mb-0.5">Submitted On</p>
                      <p className="font-medium text-gray-800 text-sm">{new Date(document.submittedAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card border-2 border-primary-blue/10">
                <h3 className="font-bold text-gray-900 mb-4">Verification Action</h3>
                
                {error && <div className="text-danger-red text-sm mb-4 font-medium bg-danger-red/10 p-2 rounded">{error}</div>}
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Remarks (required for rejection)</label>
                  <textarea
                    className="input-field min-h-[120px] resize-none"
                    placeholder="Enter observation notes or reason for rejection..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => handleAction('REJECTED')}
                    disabled={actionLoading}
                    className="flex items-center justify-center gap-2 border-2 border-danger-red text-danger-red px-4 py-3 rounded-xl hover:bg-danger-red hover:text-white transition font-bold"
                  >
                    <XCircle size={20} /> Reject
                  </button>
                  <button 
                    onClick={() => handleAction('APPROVED')}
                    disabled={actionLoading}
                    className="flex items-center justify-center gap-2 bg-success-green text-white px-4 py-3 rounded-xl hover:bg-green-600 transition shadow-md shadow-success-green/20 font-bold"
                  >
                    <CheckCircle size={20} /> Approve
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReviewKyc;
