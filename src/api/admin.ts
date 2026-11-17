import { MentorRosterItem, MOCK_MENTORS_ROSTER } from '../mock/mentorsList';
import { meetsApi } from './meets';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface AdminDashboardData {
  roster: MentorRosterItem[];
  totalMentors: number;
  avgCompleted: string;
  flaggedCount: number;
}

export const adminApi = {
  async getDashboardData(): Promise<AdminDashboardData> {
    await delay(150);

    // Get live meets to synchronize Tanmay's meets if he added new ones
    const allMeets = await meetsApi.getAllMeets();

    const roster = MOCK_MENTORS_ROSTER.map((mentor) => {
      const mentorMeets = allMeets.filter((m) => m.mentorId === mentor.id);
      if (mentorMeets.length > 0) {
        const hasFlag = mentorMeets.some((m) => m.status === 'flagged');
        return {
          ...mentor,
          completedMeets: mentorMeets.length,
          hasFlaggedSelfie: hasFlag,
        };
      }
      return mentor;
    });

    const totalMentors = roster.length;
    const totalCompleted = roster.reduce((sum, m) => sum + m.completedMeets, 0);
    const avgCompleted = totalMentors > 0 ? (totalCompleted / totalMentors).toFixed(1) : '0';
    const flaggedCount = roster.filter((m) => m.hasFlaggedSelfie).length;

    return {
      roster,
      totalMentors,
      avgCompleted,
      flaggedCount,
    };
  },

  // Fetch detailed meet logs & mentee list for a specific mentor
  async getMentorDetail(mentorId: string) {
    await delay(150);
    const allMeets = await meetsApi.getAllMeets();
    const mentorMeets = allMeets.filter((m) => m.mentorId === mentorId);
    const mentorInfo = MOCK_MENTORS_ROSTER.find((m) => m.id === mentorId);

    return {
      mentor: mentorInfo || {
        id: mentorId,
        name: 'Unknown Mentor',
        email: `${mentorId}@smp.college.edu`,
        department: 'Engineering',
        menteeCount: 6,
        completedMeets: mentorMeets.length,
        checkpointsRequired: 6,
        hasFlaggedSelfie: mentorMeets.some((m) => m.status === 'flagged'),
      },
      meets: mentorMeets,
    };
  },

  // Review & mark AI flag as verified or false alarm
  async reviewFlag(meetId: string, resolution: 'not_ai' | 'confirmed'): Promise<void> {
    await delay(150);
    const allMeets = await meetsApi.getAllMeets();
    const updated = allMeets.map((m) => {
      if (m.id === meetId) {
        return {
          ...m,
          status: (resolution === 'not_ai' ? 'reviewed' : 'flagged') as any,
        };
      }
      return m;
    });
    localStorage.setItem('ismp_meet_logs', JSON.stringify(updated));
  },
};
