import { Mentee } from '../types';
import { MOCK_MENTEES } from '../mock/mentees';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const LOCAL_STORAGE_KEY_PREFIX = 'ismp_mentees_';

export interface MenteeInput {
  id?: string;
  rollNumber: string;
  name: string;
  department: string;
}

export const menteesApi = {
  // Fetch mentees for a mentor (checking localStorage first, falling back to mock)
  async getMentees(mentorId: string): Promise<Mentee[]> {
    await delay(150);

    const stored = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${mentorId}`);
    if (stored) {
      try {
        const parsed: Mentee[] = JSON.parse(stored);
        // Normalize any old 5-digit format (26B0XXXX) to 4-digit format (26BXXXX)
        const normalized = parsed.map((m) => {
          if (m.rollNumber && /^26B0\d{4}$/.test(m.rollNumber)) {
            return { ...m, rollNumber: `26B${m.rollNumber.slice(4)}` };
          }
          return m;
        });
        return normalized;
      } catch {
        // fallback to mock on parse error
      }
    }

    const initial = MOCK_MENTEES.filter((m) => m.mentorId === mentorId);
    return initial;
  },

  // Save updated mentee list to localStorage
  async saveMentees(mentorId: string, inputs: MenteeInput[]): Promise<Mentee[]> {
    await delay(200);

    const sanitizedMentees: Mentee[] = inputs
      .filter((input) => input.name.trim() !== '')
      .map((input, index) => ({
        id: input.id || `mentee_${Date.now()}_${index}`,
        rollNumber: input.rollNumber.trim(),
        name: input.name.trim(),
        department: input.department.trim(),
        mentorId,
      }));

    localStorage.setItem(
      `${LOCAL_STORAGE_KEY_PREFIX}${mentorId}`,
      JSON.stringify(sanitizedMentees)
    );

    return sanitizedMentees;
  },
};
