import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Community, COMMUNITY_THEME_LABELS } from '@tt/data-access/communities';
import { AvatarCircleComponent, SvgIconComponent } from '@tt/common-ui';

@Component({
  selector: 'lib-community-card',
  imports: [AvatarCircleComponent, SvgIconComponent],
  templateUrl: './community-card.component.html',
  styleUrl: './community-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityCardComponent {
  community = input.required<Community>();
  isOwner = input(false);

  subscriptionToggle = output<Community>();

  themeLabels = COMMUNITY_THEME_LABELS;
}
