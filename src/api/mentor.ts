import { Mentee, MeetLog } from '../types';
import { menteesApi } from './mentees';
import { MOCK_MEETS } from '../mock/meets';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Constant checkpoint requirement set by SMPCs (Section 4 & 6)
export const DEFAULT_CHECKPOINTS_REQUIRED = 6;

// Mentor-safe meet log type: guarantees aiScore and status are omitted
export type MentorSafeMeetLog = Omit<MeetLog, 'aiScore' | 'status'>;

export interface MentorDashboardData {
  mentees: Mentee[];
  meetLogs: MentorSafeMeetLog[];
  checkpointsRequired: number;
}

export const mentorApi = {
  // Fetch dashboard data for the active mentor
  async getDashboardData(mentorId: string): Promise<MentorDashboardData> {
    await delay(150);

    // Fetch mentees via menteesApi (which respects localStorage updates!)
    const mentees = await menteesApi.getMentees(mentorId);

    // Filter meets and STRIP aiScore & status (non-negotiable privacy rule)
    const rawMeets = MOCK_MEETS.filter((m) => m.mentorId === mentorId);
    const mentorSafeMeets: MentorSafeMeetLog[] = rawMeets.map((meet) => {
      const { aiScore: _ai, status: _st, ...safe } = meet;
      return safe;
    });

    return {
      mentees,
      meetLogs: mentorSafeMeets,
      checkpointsRequired: DEFAULT_CHECKPOINTS_REQUIRED,
    };
  },
};
