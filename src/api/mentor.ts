import { Mentee, MeetLog } from '../types';
import { menteesApi } from './mentees';
import { meetsApi } from './meets';

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

    // Fetch mentees via menteesApi (respects localStorage)
    const mentees = await menteesApi.getMentees(mentorId);

    // Fetch meets via meetsApi (respects localStorage) and STRIP aiScore & status
    const rawMeets = await meetsApi.getMentorMeets(mentorId);
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
