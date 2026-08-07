export const ProfileEndpoints = {
  getTestAccounts: '/account/test_accounts',
  getMe: '/account/me',
  read: (id: string) => `/account/${id}`,
  getSubscribers: '/account/subscribers/',
  updateMe: '/account/me',
  uploadAvatar: '/account/upload_image',
  getAccounts: '/account/accounts',
} as const;
