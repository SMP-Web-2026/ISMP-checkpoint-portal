import { Mentee } from '../types';

// Initial mock mentees assigned to Tanmay (Cohort 2026-2027) with roll numbers (26BXXXX: 4 digits after 26B)
export const MOCK_MENTEES: Mentee[] = [
  { id: 'mentee_1', rollNumber: '26B0301', name: 'Rohan Sharma', department: 'Computer Science', mentorId: 'mentor_tanmay' },
  { id: 'mentee_2', rollNumber: '26B0314', name: 'Ananya Verma', department: 'Electrical Engineering', mentorId: 'mentor_tanmay' },
  { id: 'mentee_3', rollNumber: '26B0328', name: 'Priyansh Patel', department: 'Mechanical Engineering', mentorId: 'mentor_tanmay' },
  { id: 'mentee_4', rollNumber: '26B0335', name: 'Sneha Kulkarni', department: 'Chemical Engineering', mentorId: 'mentor_tanmay' },
  { id: 'mentee_5', rollNumber: '26B0342', name: 'Devansh Rao', department: 'Civil Engineering', mentorId: 'mentor_tanmay' },
  { id: 'mentee_6', rollNumber: '26B0359', name: 'Ishita Gupta', department: 'Metallurgical Engineering', mentorId: 'mentor_tanmay' },
];
