import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { StudentFilters } from '../components/universities/StudentFilters';
import { StudentCard } from '../components/universities/StudentCard';
import { Pagination } from '../components/universities/Pagination';
import { Student } from '../types';
import { supabase } from '../lib/supabase';
import { useMediaQuery } from '../hooks/useMediaQuery';

export const UniversityStudentsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    degree: '',
    batchYear: '',
    status: '',
    course: '',
    search: ''
  });

  const isMobile = useMediaQuery('(max-width: 768px)');
  const studentsPerPage = 12;

  useEffect(() => {
    loadStudents();
  }, [id]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('university_students')
        .select('*')
        .eq('university_id', id);

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const filteredStudents = students.filter(student => {
    return (
      (!filters.degree || student.degree === filters.degree) &&
      (!filters.batchYear || student.batchYear.toString() === filters.batchYear) &&
      (!filters.status || student.status === filters.status) &&
      (!filters.course || student.course === filters.course) &&
      (!filters.search || 
        student.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * studentsPerPage,
    currentPage * studentsPerPage
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">University Students</h1>

      <StudentFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearchChange={(value) => handleFilterChange('search', value)}
        isMobile={isMobile}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {paginatedStudents.map((student) => (
              <StudentCard key={student.id} student={student} />
            ))}
          </div>

          {filteredStudents.length > studentsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No students found matching your criteria.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};