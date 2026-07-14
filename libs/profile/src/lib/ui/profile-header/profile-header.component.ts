import { Component, input } from '@angular/core';
import { Profile } from '@tt/interfaces/profile';
import { AvatarCircleComponent } from '@tt/common-ui';

@Component({
  selector: 'app-profile-header',
  imports: [AvatarCircleComponent],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss',
})
export class ProfileHeaderComponent /*aka Patient Info Header Component*/ {
  profile = input<Profile>(); /*New method, instead of @Input decorator right getting a signal*/
}
