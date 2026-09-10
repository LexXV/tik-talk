import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Community, COMMUNITY_THEME_LABELS } from '@tt/data-access/communities';
import { AvatarCircleComponent, SvgIconComponent } from '@tt/common-ui';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-community-card',
  imports: [AvatarCircleComponent, SvgIconComponent, RouterLink],
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
