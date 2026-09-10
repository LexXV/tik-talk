import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { postActions, selectCommunityPosts } from '@tt/data-access/posts';
import { PostFeedComponent } from '@tt/posts';
import { Store } from '@ngrx/store';
import { GlobalStoreService } from '@tt/data-access/common';
import {
  COMMUNITY_THEME_LABELS,
  communityActions,
  selectCommunity,
  selectCommunitySubscribers,
} from '@tt/data-access/communities';
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { CommunityHeaderComponent } from '../../ui';
import { SubscriberCircleComponent } from '@tt/profile';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-community-page',
  imports: [
    PostFeedComponent,
    SvgIconComponent,
    CommunityHeaderComponent,
    SubscriberCircleComponent,
    RouterLink,
    ImgUrlPipe,
  ],
  templateUrl: './community-page.component.html',
  styleUrl: './community-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunityPageComponent {
  #store = inject(Store);

  me = inject(GlobalStoreService).me;

  id = input.required<string>();

  communityId = computed(() => Number(this.id()));
  community = this.#store.selectSignal(selectCommunity);
  communityPosts = this.#store.selectSignal(selectCommunityPosts);
  communitySubscribers = this.#store.selectSignal(selectCommunitySubscribers);

  themeLabels = COMMUNITY_THEME_LABELS;

  isOwner = computed(() => {
    const community = this.community();
    const me = this.me();

    return !!community && !!me && community.admin.id === me.id;
  });

  constructor() {
    effect(() => {
      const communityId = this.communityId();

      if (!communityId) return;

      this.#store.dispatch(
        communityActions.loadCommunity({
          communityId,
        }),
      );

      this.#store.dispatch(
        communityActions.loadCommunitySubscribers({
          communityId,
          limit: 6,
        }),
      );

      this.#store.dispatch(
        postActions.loadCommunityPosts({
          communityId,
        }),
      );
    });
  }

  onSubscriptionToggle() {
    const community = this.community();

    if (!community || this.isOwner()) return;

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

  onCreatePost(content: string) {
    const community = this.community();
    const me = this.me();

    if (!community || !me || !this.isOwner()) return;

    this.#store.dispatch(
      postActions.createPost({
        payload: {
          title: 'Клёвый пост',
          content,
          authorId: me.id,
          communityId: community.id,
        },
      }),
    );
  }
}
