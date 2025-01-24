import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const FormInput = ({ label, ...props }: FormInputProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        {...props}
        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm ${
          props.disabled 
            ? 'bg-gray-50' 
            : 'focus:ring-indigo-500 focus:border-indigo-500'
        }`}
      />
    </div>
  );
};