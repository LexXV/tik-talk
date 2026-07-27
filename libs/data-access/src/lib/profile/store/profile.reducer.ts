import { Profile } from '..';
import { createFeature, createReducer, on } from '@ngrx/store';
import { profileActions } from './profile.actions';

export interface ProfileState {
  profiles: Profile[];
  profileFilters: Record<string, any>;
  me: Profile | null;
  profile: Profile | null;
  subscribers: Profile[];
}

export const initialState: ProfileState = {
  profiles: [],
  profileFilters: {},
  me: null,
  profile: null,
  subscribers: []
};

export const profileFeature = createFeature({
  name: 'profileFeature',
  reducer: createReducer(
    initialState,

    on(profileActions.filterEvents, (state, payload) => {
      return {
        ...state,
        profileFilters: payload.filters
      };
    }),

    on(profileActions.profilesLoaded, (state, payload) => {
      return {
        ...state,
        profiles: payload.profiles
      };
    }),

    on(profileActions.loadMeSuccess, (state, { me }) => ({
      ...state,
      me,
      profile: me
    })),

    on(profileActions.loadProfileSuccess, (state, { profile }) => ({
      ...state,
      profile
    })),

    on(profileActions.loadSubscribersSuccess, (state, { subscribers }) => ({
      ...state,
      subscribers
    })),

    on(
      profileActions.updateProfileSuccess,
      profileActions.uploadAvatarSuccess,
      (state, { profile }) => ({
        ...state,
        me: profile,
        profile
      })
    )
  )
});
