import { Component, input } from '@angular/core';
import { Profile } from '../../data/interfaces/profile.interface';
import { AvatarCircleComponent } from '../avatar-circle/avatar-circle.component';

@Component({
  selector: 'app-profile-header',
  imports: [
    AvatarCircleComponent
  ],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss',
})
export class ProfileHeaderComponent /*aka Patient Info Header Component*/ {
  profile = input<Profile>() /*New method, instead of @Input decorator right getting a signal*/
}
