export interface UserStats {
  id: string;
  username: string;
  xp: number;
  streak: number;
  longestStreak: number;
  bugsSolved: number;
  bugsFailed: number;
  totalSolveTime: number;
  hintsUsed: number;
  favoriteTopic?: string;
  createdAt: string;
}

export interface ChallengeAttempt {
  id: string;
  userId: string;
  challengeId: string;
  title: string;
  topic: string;
  difficulty: string;
  code: string;
  score: number;
  solveTime: number;
  hintsUsed: number;
  testsPassed: number;
  testsTotal: number;
  success: boolean;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  xp: number;
  streak: number;
  bugsSolved: number;
  isCurrentUser?: boolean;
}
