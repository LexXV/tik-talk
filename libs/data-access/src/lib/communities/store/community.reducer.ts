import { Community } from '..';
import { createFeature, createReducer, on } from '@ngrx/store';
import { communityActions } from './community.actions';

export interface CommunityState {
  communities: Community[];
  communityFilters: Record<string, any>;
  page: number;
  size: number;
}

export const initialState: CommunityState = {
  communities: [],
  communityFilters: {},
  page: 1,
  size: 10,
};

export const communityFeature = createFeature({
  name: 'communityFeature',
  reducer: createReducer(
    initialState,

    on(communityActions.filterCommunities, (state, payload) => {
      return {
        ...state,
        communities: [],
        communityFilters: payload.filters,
        page: 1,
      };
    }),

    on(communityActions.communitiesLoaded, (state, payload) => {
      return {
        ...state,
        communities: state.communities.concat(payload.communities),
      };
    }),

    on(communityActions.setPage, (state, payload) => {
      let page = payload.page;

      if (!page) page = state.page + 1;

      return {
        ...state,
        page,
      };
    }),

    on(communityActions.communityJoined, (state, payload) => {
      return {
        ...state,
        communities: state.communities.map((community) => {
          if (community.id === payload.communityId) {
            return {
              ...community,
              isJoined: true,
            };
          }

          return community;
        }),
      };
    }),

    on(communityActions.communityLeft, (state, payload) => {
      return {
        ...state,
        communities: state.communities.map((community) => {
          if (community.id === payload.communityId) {
            return {
              ...community,
              isJoined: false,
            };
          }

          return community;
        }),
      };
    }),
  ),
});
