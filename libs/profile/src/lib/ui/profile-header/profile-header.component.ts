import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { Profile, selectMe } from '@tt/data-access/profile';
import { AvatarCircleComponent } from '@tt/common-ui';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-profile-header',
  imports: [AvatarCircleComponent],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileHeaderComponent {
  store = inject(Store);

  profile = input<Profile>();
  me = this.store.selectSignal(selectMe);
}
