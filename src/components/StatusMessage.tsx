import React from 'react';
import { StatusMessage as StatusMessageType } from '../types';

interface Props {
  status: StatusMessageType;
}

export const StatusMessage: React.FC<Props> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status.type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className={`p-3 rounded-lg border text-center font-medium ${getStatusStyles()}`}>
      {status.message}
    </div>
  );
};