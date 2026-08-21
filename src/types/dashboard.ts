export interface UserProfile {
  id?: string;
  name: string;
  username: string;
  email: string;
  university: string;
  role?: string;
  location?: string;
  bio?: string;
  avatar?: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  progress: number;
  updatedAt: string;
  visibility: string;
  stars: number;
  forks: number;
  commits: number;
  daysActive: number;
  views?: number;
  likes: number;
  status: "Shipped" | "Active" | "In Development";
  tech: string[];
  github: string;
}

export interface CommunityProject {
  id: string;
  name: string;
  creatorName: string;
  creatorHandle: string;
  university: string;
  description: string;
  tech: string[];
  likes: number;
  views?: number;
  updatedAt: string;
  github: string;
}

export interface LeaderboardItem {
  rank: number;
  name: string;
  username: string;
  campus: string;
  points: number;
  projects: number;
  avatar: string;
}

export interface FriendItem {
  id: string;
  name: string;
  username: string;
  university: string;
  xp: number;
  level: number;
  projects: number;
  status: "online" | "offline";
  isFriend: boolean;
  avatar: string;
}

export interface ChatMessage {
  id: string;
  sender: "me" | "friend";
  text: string;
  time: string;
}

export interface ActivityItem {
  id: number;
  actor: string;
  action: string;
  target: string;
  time: string;
}
