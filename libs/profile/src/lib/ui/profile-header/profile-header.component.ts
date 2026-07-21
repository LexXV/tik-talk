import { Component, inject, input } from '@angular/core';
import { Profile } from '@tt/interfaces/profile';
import { AvatarCircleComponent } from '@tt/common-ui';
import { Store } from '@ngrx/store';
import { selectMe } from '../../data';

@Component({
  selector: 'app-profile-header',
  imports: [AvatarCircleComponent],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss',
})
export class ProfileHeaderComponent /*aka Patient Info Header Component*/ {
  store = inject(Store);

  profile = input<Profile>(); /*New method, instead of @Input decorator right getting a signal*/
  me = this.store.selectSignal(selectMe);
}
