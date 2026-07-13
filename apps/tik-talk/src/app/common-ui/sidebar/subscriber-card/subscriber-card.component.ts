import { Component, Input } from '@angular/core';
import { Profile } from '@tt/profile';
import { ImgUrlPipe } from '@tt/common-ui';

@Component({
  selector: 'app-subscriber-card',
  imports: [ImgUrlPipe],
  templateUrl: './subscriber-card.component.html',
  styleUrl: './subscriber-card.component.scss',
})
export class SubscriberCardComponent {
  @Input({ required: true }) profile!: Profile;
}
