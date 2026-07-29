import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AvatarCircleComponent, ChatDatePipe } from '@tt/common-ui';
import { LastMessageRes } from '@tt/data-access/chats';

@Component({
  selector: 'button[chats]',
  imports: [AvatarCircleComponent, ChatDatePipe],
  templateUrl: './chats-btn.component.html',
  styleUrl: './chats-btn.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatsBtnComponent /*aka Clinical Orders Worklist Row*/ {
  chat = input<LastMessageRes>();
}
