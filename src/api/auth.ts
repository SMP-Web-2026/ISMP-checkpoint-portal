import { User } from '../types';
import { MOCK_USERS } from '../mock/users';

// Simulated API latency to mimic realistic network calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const authApi = {
  // Login with email or quick-demo role selector
  async login(emailOrRole: string): Promise<User> {
    await delay(200); // 200ms simulated network delay

    const trimmed = emailOrRole.trim().toLowerCase();

    // Check if role name was provided directly
    if (trimmed === 'mentor') {
      return MOCK_USERS.find((u) => u.role === 'mentor')!;
    }
    if (trimmed === 'admin' || trimmed === 'smpc_admin') {
      return MOCK_USERS.find((u) => u.role === 'smpc_admin')!;
    }

    // Match by email
    const found = MOCK_USERS.find((u) => u.email.toLowerCase() === trimmed);
    if (found) {
      return found;
    }

    // If user enters any generic mentor email
    if (trimmed.includes('mentor') || !trimmed.includes('admin')) {
      return {
        id: `mentor_${Date.now()}`,
        name: trimmed.split('@')[0] || 'Demo Mentor',
        email: trimmed,
        role: 'mentor',
      };
    }

    return {
      id: `admin_${Date.now()}`,
      name: 'SMPC Coordinator',
      email: trimmed,
      role: 'smpc_admin',
    };
  },

  // Mock logout
  async logout(): Promise<void> {
    await delay(100);
  },
};
