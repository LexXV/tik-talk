import { ChatWSError, ChatWSMessage, ChatWSNewMessage, ChatWSUnreadMessage } from './chats-ws-message.interface';

export function isUnreadMessage(message: ChatWSMessage): message is ChatWSUnreadMessage {
  return 'action' in message && message.action === 'unread';
}

export function isNewMessage(message: ChatWSMessage): message is ChatWSNewMessage {
  return 'action' in message && message.action === 'message';
}

export const isWSError = (message: ChatWSMessage): message is ChatWSError => {
  return 'status' in message && message.status === 'error';
};

export const isTokenExpiredError = (message: ChatWSError) => {
  return message.message === 'Invalid token';
};
