import { inject, Injectable, signal } from '@angular/core';
import { Chat, LastMessageRes, Message } from '..';
import { map } from 'rxjs';
import { ApiService, GlobalStoreService } from '@tt/shared';
import { ChatsEndpoints, MessageEndpoints } from '../endpoints/chats.endpoints';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  api = inject(ApiService);

  me = inject(GlobalStoreService).me;

  activeChatMessages = signal<Message[]>([]);

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
