import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { ProfileHeaderComponent } from '../../ui';
import {
  profileActions,
  selectMe,
  selectProfile,
  selectSubscribers,
} from '@tt/data-access/profile';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ImgUrlPipe, SvgIconComponent } from '@tt/common-ui';
import { PostFeedComponent } from '@tt/posts';
import { Store } from '@ngrx/store';
import { SubscriberCircleComponent } from '../subscriber-circle/subscriber-circle.component';

@Component({
  selector: 'lib-profile-page',
  imports: [
    ProfileHeaderComponent,
    SvgIconComponent,
    RouterLink,
    ImgUrlPipe,
    PostFeedComponent,
    SubscriberCircleComponent,
    RouterOutlet,
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent {
  store = inject(Store);
  route = inject(ActivatedRoute);
  router = inject(Router);

  me = this.store.selectSignal(selectMe);
  subscribers = this.store.selectSignal(selectSubscribers);
  isMyPage = signal(false);
  profile = this.store.selectSignal(selectProfile);

  currentProfile = computed(() => (this.isMyPage() ? this.me() : this.profile()));

  //id = input();

  constructor() {
    this.route.params.pipe(takeUntilDestroyed()).subscribe(({ id }) => {
      const isMe = id === 'me';

      this.isMyPage.set(isMe);

      this.store.dispatch(isMe ? profileActions.loadMe() : profileActions.loadProfile({ id }));

      this.store.dispatch(profileActions.loadSubscribers({ limit: 6 }));
    });

    /*effect(() => {
      console.log(this.id());
    });*/
  }

  async sendMessage(userId: number) {
    this.router.navigate(['/chats', 'new'], { queryParams: { userId } });
  }
}
