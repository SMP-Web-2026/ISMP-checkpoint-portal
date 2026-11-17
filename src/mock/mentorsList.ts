export interface MentorRosterItem {
  id: string;
  name: string;
  email: string;
  department: string;
  menteeCount: number;
  completedMeets: number;
  checkpointsRequired: number;
  hasFlaggedSelfie: boolean;
}

// Realistic mock cohort of mentors for SMPC evaluation
export const MOCK_MENTORS_ROSTER: MentorRosterItem[] = [
  {
    id: 'mentor_tanmay',
    name: 'Tanmay Sonkar',
    email: 'tanmay@smp.college.edu',
    department: 'Computer Science',
    menteeCount: 6,
    completedMeets: 4,
    checkpointsRequired: 6,
    hasFlaggedSelfie: false,
  },
  {
    id: 'mentor_aarav',
    name: 'Aarav Mehta',
    email: 'aarav.m@smp.college.edu',
    department: 'Electrical Engineering',
    menteeCount: 12,
    completedMeets: 6,
    checkpointsRequired: 6,
    hasFlaggedSelfie: false,
  },
  {
    id: 'mentor_riya',
    name: 'Riya Sengupta',
    email: 'riya.s@smp.college.edu',
    department: 'Mechanical Engineering',
    menteeCount: 12,
    completedMeets: 2,
    checkpointsRequired: 6,
    hasFlaggedSelfie: true, // Example of flagged selfie for human review
  },
  {
    id: 'mentor_sid',
    name: 'Siddharth Joshi',
    email: 'sid.j@smp.college.edu',
    department: 'Chemical Engineering',
    menteeCount: 6,
    completedMeets: 5,
    checkpointsRequired: 6,
    hasFlaggedSelfie: false,
  },
  {
    id: 'mentor_pooja',
    name: 'Pooja Nair',
    email: 'pooja.n@smp.college.edu',
    department: 'Civil Engineering',
    menteeCount: 12,
    completedMeets: 3,
    checkpointsRequired: 6,
    hasFlaggedSelfie: false,
  },
  {
    id: 'mentor_kunal',
    name: 'Kunal Deshmukh',
    email: 'kunal.d@smp.college.edu',
    department: 'Metallurgical Engineering',
    menteeCount: 6,
    completedMeets: 1,
    checkpointsRequired: 6,
    hasFlaggedSelfie: true, // Example of flagged selfie for review
  },
  {
    id: 'mentor_ananya',
    name: 'Ananya Roy',
    email: 'ananya.r@smp.college.edu',
    department: 'Computer Science',
    menteeCount: 12,
    completedMeets: 6,
    checkpointsRequired: 6,
    hasFlaggedSelfie: false,
  },
];
