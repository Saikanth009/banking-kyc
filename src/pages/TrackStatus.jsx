import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatusBadge from '../components/StatusBadge';
import api from '../api/axiosConfig';
import { Download, RefreshCw, FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TrackStatus = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/customer/status');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const getTimelineSteps = (doc) => {
    const steps = [
      { text: 'Application Submitted', active: true, date: doc.submittedAt, icon: <FileText size={18} /> },
      { text: 'Under Review', active: doc.status !== 'PENDING', date: doc.reviewedAt ? doc.reviewedAt : null, icon: <Clock size={18} /> },
    ];
    
    if (doc.status === 'APPROVED') {
      steps.push({ text: 'Application Approved', active: true, date: doc.reviewedAt, icon: <CheckCircle2 size={18} className="text-success-green" /> });
    } else if (doc.status === 'REJECTED') {
      steps.push({ text: 'Application Rejected', active: true, date: doc.reviewedAt, icon: <XCircle size={18} className="text-danger-red" /> });
    } else {
      steps.push({ text: 'Decision Pending', active: false, date: null, icon: <CheckCircle2 size={18} /> });
    }
    
    return steps;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar role="CUSTOMER" />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Track KYC Status</h1>
            <button 
              onClick={fetchDocuments}
              className="flex items-center gap-2 text-primary-blue hover:text-blue-800 font-medium bg-white px-4 py-2 border border-gray-200 rounded-lg shadow-sm"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>

          <div className="space-y-6 max-w-4xl">
            {loading ? (
              <div className="text-center py-10">Loading...</div>
            ) : documents.length === 0 ? (
              <div className="card text-center py-10">
                <p className="text-gray-500 mb-4">You have no KYC applications to track.</p>
                <button onClick={() => navigate('/customer/submit')} className="btn-primary">Submit Now</button>
              </div>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="card">
                  <div className="flex justify-between items-start mb-6 pb-6 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-bold text-gray-900">{doc.documentType} Verification</h2>
                        <StatusBadge status={doc.status} />
                      </div>
                      <p className="text-sm text-gray-500">ID: #{doc.id.toString().padStart(6, '0')} • Submitted on {new Date(doc.submittedAt).toLocaleDateString()}</p>
                    </div>
                    {doc.status === 'REJECTED' && (
                      <button 
                        onClick={() => navigate('/customer/submit')}
                        className="btn-accent text-sm"
                      >
                        Re-apply Now
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                      <h3 className="font-semibold text-gray-900 mb-4">Tracking Timeline</h3>
                      <div className="relative border-l-2 border-primary-blue/20 ml-3 space-y-6">
                        {getTimelineSteps(doc).map((step, idx) => (
                          <div key={idx} className="relative pl-6">
                            <span className={`absolute -left-3.5 top-0 w-7 h-7 rounded-full flex items-center justify-center ${step.active ? (doc.status === 'REJECTED' && idx === 2 ? 'bg-danger-red/10 border-danger-red' : doc.status === 'APPROVED' && idx === 2 ? 'bg-success-green/10 border-success-green' : 'bg-primary-blue text-white') : 'bg-gray-100 border border-gray-300 text-gray-400'}`}>
                              {step.icon}
                            </span>
                            <div>
                              <p className={`font-medium ${step.active ? 'text-gray-900' : 'text-gray-400'}`}>{step.text}</p>
                              {step.date && <p className="text-xs text-gray-500 mt-1">{new Date(step.date).toLocaleString()}</p>}
                            </div>
                          </div>
                        ))}
                      </div>

                      {doc.status === 'REJECTED' && doc.remarks && (
                        <div className="mt-6 bg-danger-red/5 border border-danger-red/20 rounded-xl p-4">
                          <h4 className="flex items-center gap-2 text-danger-red font-semibold mb-2">
                            <XCircle size={18} /> Rejection Reason
                          </h4>
                          <p className="text-gray-700 text-sm">{doc.remarks}</p>
                        </div>
                      )}
                      
                      {doc.status === 'APPROVED' && doc.remarks && (
                        <div className="mt-6 bg-success-green/5 border border-success-green/20 rounded-xl p-4">
                          <h4 className="flex items-center gap-2 text-success-green font-semibold mb-2">
                            <CheckCircle2 size={18} /> Officer Remarks
                          </h4>
                          <p className="text-gray-700 text-sm">{doc.remarks}</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 self-start">
                      <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wider">Document Details</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">Document</span>
                          <span className="font-medium text-gray-900">{doc.documentType}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">File Type</span>
                          <span className="font-medium text-gray-900 uppercase">{doc.filePath.split('.').pop()}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                          <span className="text-gray-500">Size</span>
                          <span className="font-medium text-gray-900">Unknown</span>
                        </div>
                      </div>
                      <a href={`http://localhost:8080${doc.filePath}`} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-center gap-2 w-full bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition text-sm font-medium transition">
                        <Download size={16} /> View Document
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TrackStatus;
