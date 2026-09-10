import { ChangeDetectionStrategy, Component, HostListener, input, signal } from '@angular/core';
import { ImgUrlPipe, PortalComponent } from '@tt/common-ui';
import { RouterLink } from '@angular/router';
import { Profile } from '@tt/data-access/profile';

@Component({
  selector: 'lib-subscriber-circle',
  imports: [ImgUrlPipe, RouterLink, PortalComponent],
  templateUrl: './subscriber-circle.component.html',
  styleUrl: './subscriber-circle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriberCircleComponent {
  subscriber = input<Profile>();

  isMouseOver = signal(false);

  @HostListener('mouseover')
  onMouseOver() {
    this.isMouseOver.set(true);
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.isMouseOver.set(false);
  }
}
