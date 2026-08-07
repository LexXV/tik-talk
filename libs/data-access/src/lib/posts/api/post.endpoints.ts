export const PostEndpoints = {
  create: '/post/',
  getAll: '/post/',
  read: (id: number) => `/post/${id}`,
} as const;

export const CommentEndpoints = {
  create: '/comment/',
} as const;
