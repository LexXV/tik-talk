import { createSelector } from '@ngrx/store';
import { profileFeature } from './reducer';

export const selectFilteredProfiles = createSelector(
  profileFeature.selectProfiles,
  (profiles) => profiles
);

export const selectProfileFilters = profileFeature.selectProfileFilters;

export const selectMe = createSelector(
  profileFeature.selectMe,
  (me) => me
);

export const selectProfile = createSelector(
  profileFeature.selectProfile,
  (profile) => profile
);

export const selectSubscribers = createSelector(
  profileFeature.selectSubscribers,
  (subscribers) => subscribers
);
