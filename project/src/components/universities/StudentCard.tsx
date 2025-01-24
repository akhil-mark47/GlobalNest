import React from 'react';
import { User } from 'lucide-react';
import { Student } from '../../types';

interface StudentCardProps {
  student: Student;
}

export const StudentCard = ({ student }: StudentCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {student.profilePicture ? (
            <img
              src={student.profilePicture}
              alt={student.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <User className="h-6 w-6 text-indigo-600" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-semibold text-gray-900 truncate">{student.name}</p>
          <p className="text-sm text-gray-500">ID: {student.rollNumber}</p>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Degree</p>
          <p className="font-medium">{student.degree}</p>
        </div>
        <div>
          <p className="text-gray-500">Batch Year</p>
          <p className="font-medium">{student.batchYear}</p>
        </div>
        <div>
          <p className="text-gray-500">Course</p>
          <p className="font-medium">{student.course}</p>
        </div>
        <div>
          <p className="text-gray-500">Status</p>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            student.status === 'current' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
          }`}>
            {student.status === 'current' ? 'Currently Studying' : 'Passed Out'}
          </span>
        </div>
      </div>
    </div>
  );
};