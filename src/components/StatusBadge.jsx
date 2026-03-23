import React from 'react';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

const StatusBadge = ({ status }) => {
  if (status === 'APPROVED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-success-green/10 text-success-green border border-success-green/20">
        <CheckCircle size={14} /> Approved
      </span>
    );
  }
  
  if (status === 'REJECTED') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-danger-red/10 text-danger-red border border-danger-red/20">
        <XCircle size={14} /> Rejected
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-warning-orange/10 text-warning-orange border border-warning-orange/20">
      <Clock size={14} /> Pending
    </span>
  );
};

export default StatusBadge;
