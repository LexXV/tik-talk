import { ChatConnectionWSParams, ChatsWSService } from '../interfaces/chats-ws-service.interface';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { ChatWSMessage } from '../interfaces/chats-ws-message.interface';
import { defer, finalize, mergeMap, Observable, of, retry, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthService } from '../../auth';
import { isTokenExpiredError, isWSError } from '../interfaces/chats.type-guards';

export class ChatsWSRxjsService implements ChatsWSService {
  #authService = inject(AuthService);

  #socket: WebSocketSubject<ChatWSMessage> | null = null;

  connect(params: ChatConnectionWSParams): Observable<ChatWSMessage> {
    return defer(() => {
      this.#socket = this.createSocket(params.url);

      return this.#socket;
    }).pipe(
      mergeMap(message => {
        if (isWSError(message)) {

          this.disconnect();

          if (isTokenExpiredError(message)) {
            return throwError(() => new Error('TOKEN_EXPIRED'));
          }

          return throwError(() => new Error(message.message));
        }

        params.handleMessage(message);

        return of(message);
      }),

      retry({
        delay: (error) => {
          if (error.message === 'TOKEN_EXPIRED') {
            return this.#authService.refreshAuthToken();
          }

          return throwError(() => error);
        }
      }),

      finalize(() => console.log('WebSocket closed'))
    );
  }

  sendMessage(text: string, chatId: number) {
    this.#socket?.next({
      text,
      chat_id: chatId
    });
  }

  disconnect() {
    this.#socket?.complete();
  }

  private createSocket(url: string): WebSocketSubject<ChatWSMessage> {
    return webSocket({
      url,
      protocol: [this.#authService.token ?? '']
    });
  }
}
