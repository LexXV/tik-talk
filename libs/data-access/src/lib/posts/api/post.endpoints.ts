export const PostEndpoints = {
  create: '/post/',
  getAll: '/post/',
  getCommunityPosts: (communityId: number) => `/community/${communityId}/posts`,
  read: (id: number) => `/post/${id}`,
} as const;

export const CommentEndpoints = {
  create: '/comment/',
} as const;
