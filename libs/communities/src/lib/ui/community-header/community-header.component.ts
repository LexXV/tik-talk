import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Community } from '@tt/data-access/communities';
import { AvatarCircleComponent } from '@tt/common-ui';

@Component({
  selector: 'lib-community-header',
  imports: [AvatarCircleComponent],
  templateUrl: './community-header.component.html',
  styleUrl: './community-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityHeaderComponent {
  community = input.required<Community>();
}
