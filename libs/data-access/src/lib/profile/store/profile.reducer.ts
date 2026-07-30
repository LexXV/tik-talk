import { Profile } from '..';
import { createFeature, createReducer, on } from '@ngrx/store';
import { profileActions } from './profile.actions';

export interface ProfileState {
  profiles: Profile[];
  profileFilters: Record<string, any>;
  page: number;
  size: number;
  me: Profile | null;
  profile: Profile | null;
  subscribers: Profile[];
}

export const initialState: ProfileState = {
  profiles: [],
  profileFilters: {},
  page: 1,
  size: 10,
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
        profiles: [],
        profileFilters: payload.filters,
        page: 1,
      };
    }),

    on(profileActions.profilesLoaded, (state, payload) => {
      return {
        ...state,
        profiles: state.profiles.concat(payload.profiles),
      };
    }),

    on(profileActions.setPage, (state, payload) => {
      let page = payload.page;

      if (!page) page = state.page + 1;

      return {
        ...state,
        page,
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
