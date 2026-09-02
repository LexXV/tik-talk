export const CommunityEndpoints = {
  getAll: '/community/',
  create: '/community/',
  join: (communityId: number) => `/community/${communityId}/join`,
  leave: (communityId: number) => `/community/${communityId}/join`,
} as const;
