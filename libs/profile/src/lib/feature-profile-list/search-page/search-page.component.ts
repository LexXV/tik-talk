import { ChangeDetectionStrategy, Component, computed, inject, OnInit } from '@angular/core';
import {
  Profile,
  profileActions,
  ProfileService,
  selectFilteredProfiles,
} from '@tt/data-access/profile';
import { ProfileFiltersComponent } from '..';
import { Store } from '@ngrx/store';
import { ProfileListComponent } from '../../ui';
import { firstValueFrom, scan, Subject } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { SidebarPortalComponent } from '@tt/common-ui';

@Component({
  selector: 'app-search-page',
  imports: [ProfileFiltersComponent, ProfileListComponent, AsyncPipe, SidebarPortalComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent /*implements OnInit*/ {
  store = inject(Store);
  // profileService = inject(ProfileService);
  profiles = this.store.selectSignal(selectFilteredProfiles);

  profilesLength = computed(() => this.profiles()?.length ?? 0);

  /*profilesSubject$ = new Subject<Profile[]>();

  infiniteProfiles$ = this.profilesSubject$.pipe(
    scan((acc, curr) => {
      return acc.concat(curr) as Profile[];
    }, [] as Profile[]),
  );

  page = 0;

  ngOnInit() {
    this.getNextPage();
  }

  async getNextPage() {
    this.page += 1;
    const res = await firstValueFrom(this.profileService.filterProfiles({ page: this.page }));

    this.profilesSubject$.next(res.items);
  }*/

  onScroll() {
    this.store.dispatch(profileActions.setPage({}));
    // this.getNextPage();
  }
}
