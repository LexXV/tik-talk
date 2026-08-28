import { inject, Injectable } from '@angular/core';
import {
  communityActions,
  CommunityService,
  selectCommunityFilters,
  selectCommunityPageable,
} from '..';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class CommunityEffects {
  #communityService = inject(CommunityService);
  #actions$ = inject(Actions);
  #store = inject(Store);

  filterCommunities$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(communityActions.filterCommunities, communityActions.setPage),
      withLatestFrom(
        this.#store.select(selectCommunityFilters),
        this.#store.select(selectCommunityPageable),
      ),
      switchMap(([_, filters, pageable]) => {
        return this.#communityService.getCommunities({
          ...pageable,
          ...filters,
        });
      }),
      map((res) => communityActions.communitiesLoaded({ communities: res.items })),
    );
  });

  joinCommunity$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(communityActions.joinCommunity),
      switchMap(({ communityId }) =>
        this.#communityService
          .joinCommunity(communityId)
          .pipe(map(() => communityActions.communityJoined({ communityId }))),
      ),
    );
  });

  leaveCommunity$ = createEffect(() => {
    return this.#actions$.pipe(
      ofType(communityActions.leaveCommunity),
      switchMap(({ communityId }) =>
        this.#communityService
          .leaveCommunity(communityId)
          .pipe(map(() => communityActions.communityLeft({ communityId }))),
      ),
    );
  });
}
