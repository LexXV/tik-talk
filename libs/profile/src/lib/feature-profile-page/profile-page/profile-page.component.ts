import { Component, computed, inject, signal } from '@angular/core';
import { ProfileHeaderComponent } from '../../ui';
import { profileActions, selectMe, selectProfile, selectSubscribers } from '../../data/';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { PostFeedComponent } from '@tt/posts';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-profile-page',
  imports: [
    ProfileHeaderComponent,
    SvgIconComponent,
    RouterLink,
    ImgUrlPipe,
    PostFeedComponent,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
})
export class ProfilePageComponent /*aka Patient Info Expanded Tab Component*/ {
  store = inject(Store);
  route = inject(ActivatedRoute);
  router = inject(Router);

  me = this.store.selectSignal(selectMe);
  subscribers = this.store.selectSignal(selectSubscribers);
  isMyPage = signal(false);
  profile = this.store.selectSignal(selectProfile);

  currentProfile = computed(() =>
    this.isMyPage() ? this.me() : this.profile()
  );

  constructor() {
    this.route.params
      .pipe(takeUntilDestroyed())
      .subscribe(({ id }) => {
        const isMe = id === 'me';

        this.isMyPage.set(isMe);

        this.store.dispatch(
          isMe
            ? profileActions.loadMe()
            : profileActions.loadProfile({ id })
        );

        this.store.dispatch(profileActions.loadSubscribers({ limit: 6 }));
      });
  }

  async sendMessage(userId: number) {
    this.router.navigate(['/chats', 'new'], { queryParams: { userId } });
  }
}
