import { Profile } from '../../profile';

export interface Community {
  id: number;
  admin: Profile;
  name: string;
  themes: CommunityTheme[] | null;
  tags: string[] | null;
  bannerUrl: string | null;
  avatarUrl: string | null;
  description: string | null;
  subscribersAmount: number | null;
  createdAt: string;
  isJoined: boolean;
}

export type CommunityTheme = 'PROGRAMMING' | 'TECHNOLOGY' | 'EDUCATION' | 'SPORT' | 'OTHER';

export interface CreateCommunityDto {
  name: string;
  themes: CommunityTheme[];
  tags: string[];
  description: string;
}
