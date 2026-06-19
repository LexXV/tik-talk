import { Component, input } from '@angular/core';
import { Profile } from '../../data/interfaces/profile.interface';
import { ImgUrlPipe } from '../../helpers/pipes/img-url.pipe';

@Component({
  selector: 'app-profile-header',
  imports: [
    ImgUrlPipe
  ],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss',
})
export class ProfileHeaderComponent /*aka Patient Info Header Component*/ {
  profile = input<Profile>() /*New method, instead of @Input decorator right getting a signal*/
}
