export const CommunityEndpoints = {
  getAll: '/community/',
  create: '/community/',
  read: (communityId: number) => `/community/${communityId}`,
  getSubscribers: (communityId: number) => `/community/subscribers/${communityId}`,
  join: (communityId: number) => `/community/${communityId}/join`,
  leave: (communityId: number) => `/community/${communityId}/join`,
} as const;
