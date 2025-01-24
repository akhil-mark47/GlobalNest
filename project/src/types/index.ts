// Add these types to your existing types file
export interface Student {
  id: string;
  name: string;
  rollNumber: string;
  degree: string;
  batchYear: number;
  course: string;
  status: 'current' | 'passed';
  profilePicture?: string;
  university_id: string;
}