import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Community } from '@tt/data-access/communities';
import { CommunityCardComponent } from '../community-card/community-card.component';
import { InfiniteScrollTriggerComponent } from '@tt/common-ui';

@Component({
  selector: 'lib-communities-list',
  imports: [CommunityCardComponent, InfiniteScrollTriggerComponent],
  templateUrl: './communities-list.component.html',
  styleUrl: './communities-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunitiesListComponent {
  communities = input<Community[]>([]);
  meId = input<number | null>(null);

  subscriptionToggle = output<Community>();
  loadMore = output<void>();
}
