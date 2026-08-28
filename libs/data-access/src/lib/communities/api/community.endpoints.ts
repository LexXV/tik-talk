export const CommunityEndpoints = {
  getAll: '/community/',
  join: (communityId: number) => `/community/${communityId}/join`,
  leave: (communityId: number) => `/community/${communityId}/join`,
} as const;
