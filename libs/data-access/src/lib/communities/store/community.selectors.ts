import { createSelector } from '@ngrx/store';
import { communityFeature } from './community.reducer';

export const selectCommunities = createSelector(
  communityFeature.selectCommunities,
  (communities) => communities,
);

export const selectCommunityFilters = createSelector(
  communityFeature.selectCommunityFilters,
  (filters) => filters,
);

export const selectCommunityPageable = createSelector(
  communityFeature.selectCommunityFeatureState,
  (state) => {
    return {
      page: state.page,
      size: state.size,
    };
  },
);
