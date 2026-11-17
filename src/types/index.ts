// Target Data Model strictly matching Section 4 of AGENTS.md

export type UserRole = 'mentor' | 'smpc_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Mentee {
  id: string;
  name: string;
  mentorId: string;
}

export interface MenteeNote {
  menteeId: string;
  note: string;
}

export type MeetStatus = 'pending' | 'reviewed' | 'flagged';

export interface MeetLog {
  id: string;
  mentorId: string;
  date: string; // ISO string or YYYY-MM-DD
  selfieUrl: string;
  summary: string;
  attendedMenteeIds: string[];
  menteeNotes: MenteeNote[];
  // IMPORTANT: aiScore and status must never be exposed to mentor-facing screens/responses
  aiScore?: number;
  status: MeetStatus;
}

export interface CheckpointRequirement {
  totalRequired: number; // Configurable number set by SMPCs, never hardcoded in logic
}
