import { createSelector } from '@ngrx/store';
import { communityFeature } from './community.reducer';

export const selectCommunities = createSelector(
  communityFeature.selectCommunities,
  (communities) => communities,
);

export const selectCommunity = createSelector(
  communityFeature.selectCommunity,
  (community) => community,
);

export const selectCommunitySubscribers = createSelector(
  communityFeature.selectSubscribers,
  (subscribers) => subscribers,
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
