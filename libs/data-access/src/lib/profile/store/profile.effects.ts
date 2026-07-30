import { inject, Injectable } from '@angular/core';
import { ProfileService, selectProfileFilters, selectProfilePageable } from '..';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { profileActions } from './profile.actions';
import { map, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class ProfileEffects {
  profileService = inject(ProfileService);
  actions$ = inject(Actions);
  store = inject(Store);

  filterProfiles = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.filterEvents, profileActions.setPage),
      withLatestFrom(
        this.store.select(selectProfileFilters),
        this.store.select(selectProfilePageable),
      ),
      switchMap(([_, filters, pageable]) => {
        return this.profileService.filterProfiles({
          ...pageable,
          ...filters,
        });
      }),
      map(res => profileActions.profilesLoaded({ profiles: res.items }))
    );
  });

  loadMe$ = createEffect(() =>
    this.actions$.pipe(
      ofType(profileActions.loadMe),
      switchMap(() =>
        this.profileService.getMe().pipe(
          map(me => profileActions.loadMeSuccess({ me }))
        )
      )
    )
  );

  loadProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(profileActions.loadProfile),
      switchMap(({ id }) =>
        this.profileService.getAccount(id).pipe(
          map(profile => profileActions.loadProfileSuccess({ profile }))
        )
      )
    )
  );

  loadSubscribers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(profileActions.loadSubscribers),
      switchMap(({ limit }) =>
        this.profileService.getSubscribersShortList(limit).pipe(
          map(subscribers =>
            profileActions.loadSubscribersSuccess({ subscribers })
          )
        )
      )
    )
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(profileActions.updateProfile),
      switchMap(({ profile }) =>
        this.profileService.patchProfile(profile).pipe(
          map(profile => profileActions.updateProfileSuccess({ profile }))
        )
      )
    )
  );

  uploadAvatar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(profileActions.uploadAvatar),
      switchMap(({ avatar }) =>
        this.profileService.uploadAvatar(avatar).pipe(
          map(profile => profileActions.uploadAvatarSuccess({ profile }))
        )
      )
    )
  );
}
