import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Community, communityActions, selectCommunities } from '@tt/data-access/communities';
import { CommunitiesListComponent } from '../../ui';
import { GlobalStoreService } from '@tt/data-access/common';
import { SvgIconComponent } from '@tt/common-ui';
import { CommunitiesFiltersComponent } from '../communities-filters/communities-filters.component';

@Component({
  selector: 'lib-communities-page',
  imports: [CommunitiesListComponent, SvgIconComponent, CommunitiesFiltersComponent],
  templateUrl: './communities-page.component.html',
  styleUrl: './communities-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunitiesPageComponent implements OnInit {
  #store = inject(Store);
  #globalStoreService = inject(GlobalStoreService);

  communities = this.#store.selectSignal(selectCommunities);
  me = this.#globalStoreService.me;

  ngOnInit() {
    this.#store.dispatch(
      communityActions.filterCommunities({
        filters: {},
      }),
    );
  }

  toggleSubscription(community: Community) {
    if (community.isJoined) {
      this.#store.dispatch(
        communityActions.leaveCommunity({
          communityId: community.id,
        }),
      );
      return;
    }

    this.#store.dispatch(
      communityActions.joinCommunity({
        communityId: community.id,
      }),
    );
  }

  onScroll() {
    this.#store.dispatch(communityActions.setPage({}));
  }
}
