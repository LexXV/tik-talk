export const ChatsEndpoints = {
  create: (userId: number) => `/chat/${userId}`,
  getMyChats: '/chat/get_my_chats/',
  read: (id: number) => `/chat/${id}`,
  webSocket: '/chat/ws',
} as const;

export const MessageEndpoints = {
  send: (chatId: number) => `/message/send/${chatId}`,
} as const;
