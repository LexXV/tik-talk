import { Component, inject } from '@angular/core';
import { ChatWorkspaceHeaderComponent } from './chat-workspace-header/chat-workspace-header.component';
import {
  ChatWorkspaceMessagesWrapperComponent
} from './chat-workspace-messages-wrapper/chat-workspace-messages-wrapper.component';
import { ActivatedRoute } from '@angular/router';
import { ChatsService } from '../../../data/services/chats.service';
import { switchMap, timer } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-chat-workspace',
  imports: [
    ChatWorkspaceHeaderComponent,
    ChatWorkspaceMessagesWrapperComponent,
    AsyncPipe
  ],
  templateUrl: './chat-workspace.component.html',
  styleUrl: './chat-workspace.component.scss'
})
export class ChatWorkspaceComponent /*aka Clinical Orders Worklist Row Expanded View*/ {
  route = inject(ActivatedRoute);
  chatsService = inject(ChatsService);

  activeChat$ = this.route.params
    .pipe(
      switchMap(({ id }) =>
        timer(0, 3000)
          .pipe(
            switchMap(() => this.chatsService.getChatById(+id))
          )
      )
    );
}
