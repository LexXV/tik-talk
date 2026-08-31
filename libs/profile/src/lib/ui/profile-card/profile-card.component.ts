import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Profile } from '@tt/data-access/profile';
import { ImgUrlPipe } from '@tt/common-ui';

@Component({
  selector: 'lib-profile-card',
  imports: [ImgUrlPipe],
  templateUrl: './profile-card.component.html',
  styleUrl: './profile-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileCardComponent {
  @Input({ required: true }) profile!: Profile;
}
