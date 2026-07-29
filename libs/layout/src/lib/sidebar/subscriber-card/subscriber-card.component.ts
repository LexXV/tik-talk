import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Profile } from '@tt/data-access/profile';
import { ImgUrlPipe } from '@tt/common-ui';

@Component({
  selector: 'app-subscriber-card',
  imports: [ImgUrlPipe],
  templateUrl: './subscriber-card.component.html',
  styleUrl: './subscriber-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriberCardComponent {
  @Input({ required: true }) profile!: Profile;
}
