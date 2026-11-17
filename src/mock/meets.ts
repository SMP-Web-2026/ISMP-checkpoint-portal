import { MeetLog } from '../types';

// Initial sample past meets logged by mentor_tanmay
// aiScore and status are stored here for SMPC review, but mentor API will filter them out
export const MOCK_MEETS: MeetLog[] = [
  {
    id: 'meet_4',
    mentorId: 'mentor_tanmay',
    date: '2026-11-04',
    selfieUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80',
    summary: 'Mid-semester review. Discussed upcoming quiz prep, lab coursework submissions, and academic pressure management.',
    attendedMenteeIds: ['mentee_1', 'mentee_2', 'mentee_3', 'mentee_4', 'mentee_5'],
    menteeNotes: [
      { menteeId: 'mentee_1', note: 'Prepared well for Data Structures quiz.' },
      { menteeId: 'mentee_4', note: 'Asked about electrical lab circuit practicals.' },
      { menteeId: 'mentee_5', note: 'Feeling slightly overwhelmed by multiple deadlines; suggested time-blocking.' },
    ],
    aiScore: 0.08,
    status: 'reviewed',
  },
  {
    id: 'meet_3',
    mentorId: 'mentor_tanmay',
    date: '2026-10-18',
    selfieUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&q=80',
    summary: 'Academic guidance and branch orientation session at the central library cafeteria. Discussed department electives.',
    attendedMenteeIds: ['mentee_1', 'mentee_2', 'mentee_3', 'mentee_6'],
    menteeNotes: [
      { menteeId: 'mentee_2', note: 'Interested in competitive programming clubs.' },
      { menteeId: 'mentee_6', note: 'Adjusting well to hostel life and mess food.' },
    ],
    aiScore: 0.12,
    status: 'reviewed',
  },
  {
    id: 'meet_2',
    mentorId: 'mentor_tanmay',
    date: '2026-09-24',
    selfieUrl: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=400&q=80',
    summary: 'Campus life check-in. Took a stroll around the SAC ground and answered doubts regarding institute clubs and sports facilities.',
    attendedMenteeIds: ['mentee_1', 'mentee_2', 'mentee_3', 'mentee_4', 'mentee_5', 'mentee_6'],
    menteeNotes: [
      { menteeId: 'mentee_3', note: 'Joined robotics club technical team orientation.' },
    ],
    aiScore: 0.15,
    status: 'reviewed',
  },
  {
    id: 'meet_1',
    mentorId: 'mentor_tanmay',
    date: '2026-09-05',
    selfieUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=400&q=80',
    summary: 'First introductory meet! Broke the ice, exchanged contact info, shared tips for freshers, and discussed academic schedules.',
    attendedMenteeIds: ['mentee_1', 'mentee_2', 'mentee_3', 'mentee_4', 'mentee_5', 'mentee_6'],
    menteeNotes: [
      { menteeId: 'mentee_1', note: 'Very enthusiastic, keen on coding.' },
      { menteeId: 'mentee_2', note: 'Introvert, will follow up next week.' },
    ],
    aiScore: 0.05,
    status: 'reviewed',
  },
];
