import { inject, Injectable } from '@angular/core';
import { ProfileService } from '..';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { profileActions } from './actions';
import { map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileEffects {
  profileService = inject(ProfileService);
  actions$ = inject(Actions);

  filterProfiles = createEffect(() => {
    return this.actions$.pipe(
      ofType(profileActions.filterEvents),
      switchMap(({ filters }) => {
        return this.profileService.filterProfiles(filters);
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
