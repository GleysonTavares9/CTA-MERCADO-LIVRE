import React from 'react';

interface Props {
  isVisible: boolean;
  text: string;
}

export const LoadingSpinner: React.FC<Props> = ({ isVisible, text }) => {
  if (!isVisible) return null;

  return (
    <div className="text-center py-6">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
      <p className="text-gray-600 font-medium">{text}</p>
    </div>
  );
};