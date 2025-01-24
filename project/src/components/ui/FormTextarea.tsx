import React from 'react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const FormTextarea = ({ label, ...props }: FormTextareaProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        {...props}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
      />
    </div>
  );
};