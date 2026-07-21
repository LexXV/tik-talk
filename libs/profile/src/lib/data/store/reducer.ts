import { Profile } from '@tt/interfaces/profile';
import { createFeature, createReducer, on } from '@ngrx/store';
import { profileActions } from './actions';

export interface ProfileState {
  profiles: Profile[];
  profileFilters: Record<string, any>;
}

export const initialState: ProfileState = {
  profiles: [],
  profileFilters: {}
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
    })
  )
});
