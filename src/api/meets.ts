import { MeetLog, MenteeNote } from '../types';
import { MOCK_MEETS } from '../mock/meets';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const LOCAL_STORAGE_KEY = 'ismp_meet_logs';

export interface CreateMeetInput {
  selfieUrl: string;
  summary: string;
  attendedMenteeIds: string[];
  menteeNotes: MenteeNote[];
}

export const meetsApi = {
  // Get all meet logs (initialized from MOCK_MEETS if not set)
  async getAllMeets(): Promise<MeetLog[]> {
    await delay(100);
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // fallback
      }
    }
    // Initialize localStorage with mock meets
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(MOCK_MEETS));
    return MOCK_MEETS;
  },

  // Get meets for a specific mentor
  async getMentorMeets(mentorId: string): Promise<MeetLog[]> {
    const all = await this.getAllMeets();
    return all.filter((m) => m.mentorId === mentorId);
  },

  // Create a new meet log
  async createMeetLog(mentorId: string, input: CreateMeetInput): Promise<MeetLog> {
    await delay(250);

    const all = await this.getAllMeets();

    const newLog: MeetLog = {
      id: `meet_${Date.now()}`,
      mentorId,
      date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
      selfieUrl: input.selfieUrl,
      summary: input.summary.trim(),
      attendedMenteeIds: input.attendedMenteeIds,
      menteeNotes: input.menteeNotes,
      // Default initial score for AI detection (internal only)
      aiScore: 0.04,
      status: 'pending',
    };

    const updated = [newLog, ...all];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));

    return newLog;
  },

  // Update an existing meet log (Edit meet)
  async updateMeetLog(meetId: string, updates: Partial<CreateMeetInput>): Promise<MeetLog> {
    await delay(200);
    const all = await this.getAllMeets();
    let updatedLog: MeetLog | null = null;

    const nextMeets = all.map((m) => {
      if (m.id === meetId) {
        updatedLog = {
          ...m,
          ...updates,
          summary: updates.summary !== undefined ? updates.summary.trim() : m.summary,
        };
        return updatedLog;
      }
      return m;
    });

    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextMeets));
    return updatedLog!;
  },

  // Delete a meet log
  async deleteMeetLog(meetId: string): Promise<void> {
    await delay(150);
    const all = await this.getAllMeets();
    const nextMeets = all.filter((m) => m.id !== meetId);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextMeets));
  },
};
