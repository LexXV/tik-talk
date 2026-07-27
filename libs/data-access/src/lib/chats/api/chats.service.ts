import { inject, Injectable, signal } from '@angular/core';
import { Chat, LastMessageRes, Message } from '..';
import { map, Observable } from 'rxjs';
import { ApiService, GlobalStoreService } from '../../common';
import { ChatsEndpoints, MessageEndpoints } from './chats.endpoints';
import { ChatsWSService } from '../interfaces/chats-ws-service.interface';
import { ChatsWSNativeService } from './chats-ws-native.service';
import { AuthService } from '../../auth';
import { ChatWSMessage } from '../interfaces/chats-ws-message.interface';
import { isNewMessage, isUnreadMessage } from '../interfaces/chats.type-guards';
import { ChatsWSRxjsService } from './chats-ws-rxjs.service';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  api = inject(ApiService);
  #authService = inject(AuthService);
  me = inject(GlobalStoreService).me;
  unreadCount = signal(0);
  // wsAdapter: ChatsWSService = new ChatsWSNativeService();
  wsAdapter: ChatsWSService = new ChatsWSRxjsService();

  activeChatMessages = signal<Message[]>([]);

  connectWs() {
    return this.wsAdapter.connect({
      url: `${this.api.config.apiUrl}${ChatsEndpoints.webSocket}`,
      token: this.#authService.token ?? '',
      handleMessage: this.handleWSMessage
    }) as Observable<ChatWSMessage>;
  }

  // Closures (Замыкания)
  handleWSMessage = (message: ChatWSMessage) => {
    if (!('action' in message)) return;

    if (isUnreadMessage(message)) {
      this.unreadCount.set(message.data.count);
    }

    if (isNewMessage(message)) {
      this.activeChatMessages.set([
        ...this.activeChatMessages(),
        {
          id: message.data.id,
          userFromId: message.data.author,
          personalChatId: message.data.chat_id,
          text: message.data.message,
          createdAt: message.data.created_at,
          isRead: false,
          isMine: false
        }
      ]);
    }
  };

  createChat(userId: number) {
    return this.api.post<Chat>(ChatsEndpoints.create(userId), {});
  }

  getMyChats() {
    return this.api.get<LastMessageRes[]>(ChatsEndpoints.getMyChats);
  }

  getChatById(chatId: number) {
    return this.api.get<Chat>(ChatsEndpoints.read(chatId)).pipe(
      map((chat) => {
        const patchedMessages = chat.messages.map((message) => {
          return {
            ...message,
            user: chat.userFirst.id === message.userFromId ? chat.userFirst : chat.userSecond,
            isMine: message.userFromId === this.me()!.id,
          };
        });

        this.activeChatMessages.set(patchedMessages);

        return {
          ...chat,
          companion: chat.userFirst.id === this.me()!.id ? chat.userSecond : chat.userFirst,
          messages: patchedMessages,
        };
      }),
    );
  }

  sendMessage(chatId: number, message: string) {
    return this.api.post<Message>(
      MessageEndpoints.send(chatId),
      {},
      {
        params: {
          message,
        },
      },
    );
  }
}
