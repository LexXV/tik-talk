import { Component, input } from '@angular/core';
import { AvatarCircleComponent } from '../../../common-ui/avatar-circle/avatar-circle.component';
import { LastMessageRes } from '../../../data/interfaces/chats.interface';
import { ChatDatePipe } from '../../../helpers/pipes/chat-date.pipe';

@Component({
  selector: 'button[chats]',
  imports: [
    AvatarCircleComponent,
    ChatDatePipe
  ],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss'
})
export class ChatsBtnComponent /*aka Clinical Orders Worklist Row*/ {
  chat = input<LastMessageRes>();
}
