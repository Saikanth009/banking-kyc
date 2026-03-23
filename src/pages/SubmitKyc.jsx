import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import api from '../api/axiosConfig';
import { UploadCloud, CheckCircle2, ChevronRight, FileType } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SubmitKyc = () => {
  const [step, setStep] = useState(1);
  const [documentType, setDocumentType] = useState('AADHAAR');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('documentType', documentType);
    formData.append('file', file);

    try {
      await api.post('/customer/submit-kyc', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setStep(3); // Success step
    } catch (err) {
      setError('Failed to submit document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex">
        <Sidebar role="CUSTOMER" />
        <main className="flex-1 p-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Submit KYC Application</h1>

            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-10 relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary-blue -z-10 transition-all duration-500 rounded-full" style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}></div>
              
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-primary-blue text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>1</div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-500 ${step >= 2 ? 'bg-primary-blue text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>2</div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors duration-500 ${step >= 3 ? 'bg-success-green text-white shadow-lg' : 'bg-gray-200 text-gray-500'}`}>3</div>
            </div>

            <div className="card relative overflow-hidden">
              {error && (
                <div className="mb-6 bg-danger-red/10 border-l-4 border-danger-red text-danger-red p-4 rounded-md text-sm font-medium">
                  {error}
                </div>
              )}

              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><FileType className="text-primary-blue" /> Document Details</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Document Type</label>
                      <select 
                        className="input-field max-w-md w-full"
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                      >
                        <option value="AADHAAR">Aadhaar Card</option>
                        <option value="PAN">PAN Card</option>
                        <option value="PASSPORT">Passport</option>
                        <option value="DRIVING_LICENSE">Driving License</option>
                      </select>
                    </div>
                    <button 
                      onClick={() => setStep(2)}
                      className="btn-primary flex items-center gap-2 mt-8"
                    >
                      Next Step <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                  <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><UploadCloud className="text-primary-blue" /> Upload File</h2>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center hover:border-primary-blue hover:bg-blue-50/30 transition cursor-pointer relative group">
                    <input 
                      type="file" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <UploadCloud className="mx-auto text-primary-blue group-hover:scale-110 transition-transform mb-4" size={48} />
                    {file ? (
                      <p className="text-gray-900 font-semibold text-lg">{file.name}</p>
                    ) : (
                      <>
                        <p className="text-gray-900 font-medium text-lg mb-1">Click or drag file to this area to upload</p>
                        <p className="text-gray-500 text-sm">Supported formats: PDF, JPG, PNG (Max 10MB)</p>
                      </>
                    )}
                  </div>

                  <div className="flex justify-between mt-8">
                    <button onClick={() => setStep(1)} className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">Back</button>
                    <button 
                      onClick={handleSubmit}
                      disabled={loading || !file}
                      className={`btn-primary flex items-center gap-2 ${loading || !file ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {loading ? 'Submitting...' : 'Submit Application'}
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-10 animate-in zoom-in duration-500">
                  <div className="w-20 h-20 bg-success-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="text-success-green" size={40} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Successful!</h2>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">Your KYC document has been securely submitted for review. An officer will verify it shortly.</p>
                  
                  <div className="flex justify-center gap-4">
                    <button onClick={() => navigate('/customer/dashboard')} className="btn-primary">Go to Dashboard</button>
                    <button onClick={() => navigate('/customer/status')} className="px-4 py-2 border border-primary-blue text-primary-blue font-medium rounded-lg hover:bg-primary-blue hover:text-white transition">Track Status</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SubmitKyc;
