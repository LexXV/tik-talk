import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ChatWorkspaceMessageComponent } from './chat-workspace-message/chat-workspace-message.component';
import { MessageInputComponent } from '../../../../common-ui/message-input/message-input.component';
import { ChatsService } from '../../../../data/services/chats.service';
import { Chat } from '../../../../data/interfaces/chats.interface';
import { debounceTime, firstValueFrom, fromEvent } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DateTime } from 'luxon';
import { ChatDatePipe } from '@tt/common-ui';

@Component({
  selector: 'app-chat-workspace-messages-wrapper',
  imports: [ChatWorkspaceMessageComponent, MessageInputComponent, ChatDatePipe],
  templateUrl: './chat-workspace-messages-wrapper.component.html',
  styleUrl: './chat-workspace-messages-wrapper.component.scss',
})
export class ChatWorkspaceMessagesWrapperComponent /*aka Clinical Order Customization Page*/
  implements AfterViewInit
{
  chatsService = inject(ChatsService);
  r2 = inject(Renderer2);

  chat = input.required<Chat>();

  messages = this.chatsService.activeChatMessages;

  @ViewChild('messagesWrapper')
  messagesWrapper!: ElementRef<HTMLDivElement>;

  constructor() {
    fromEvent(window, 'resize')
      .pipe(debounceTime(200), takeUntilDestroyed())
      .subscribe(() => this.resizeWrapper());
  }

  ngAfterViewInit() {
    this.resizeWrapper();
  }

  async onSendMessage(messageText: string) {
    await firstValueFrom(this.chatsService.sendMessage(this.chat().id, messageText));

    await firstValueFrom(this.chatsService.getChatById(this.chat().id));
  }

  resizeWrapper() {
    const { top } = this.messagesWrapper.nativeElement.getBoundingClientRect();

    const height = window.innerHeight - top - 24 - 24 - 16 - 16 - 44;

    this.r2.setStyle(this.messagesWrapper.nativeElement, 'height', `${height}px`);
  }

  isNewGroup(index: number): boolean {
    if (index === 0) {
      return true;
    }

    const current = this.toDateTime(this.messages()[index].createdAt);
    const previous = this.toDateTime(this.messages()[index - 1].createdAt);

    return !current.hasSame(previous, 'day');
  }

  private toDateTime(iso: string) {
    return DateTime.fromISO(iso, { zone: 'utc' }).toLocal();
  }
}
