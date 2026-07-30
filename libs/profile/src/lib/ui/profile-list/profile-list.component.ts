import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Profile } from '@tt/data-access/profile';
import { ProfileCardComponent } from '..';
import { InfiniteScrollTriggerComponent } from '@tt/common-ui';
import {
  WaIntersectionObservee,
  WaIntersectionObserverDirective,
} from '@ng-web-apis/intersection-observer';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'lib-profile-list',
  imports: [
    ProfileCardComponent,
    InfiniteScrollTriggerComponent,
    WaIntersectionObserverDirective,
    WaIntersectionObservee,
    InfiniteScrollDirective,
  ],
  templateUrl: './profile-list.component.html',
  styleUrl: './profile-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileListComponent {
  profiles = input<Profile[]>([]);

  loadMore = output<void>();

  /*onIntersection(entries: IntersectionObserverEntry[]) {
    if (!entries.length) return;

    if (entries[0].intersectionRatio > 0) {
      this.loadMore.emit();
    }
  }*/
}
