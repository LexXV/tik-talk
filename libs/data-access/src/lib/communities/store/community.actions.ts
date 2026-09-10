import { createActionGroup, props } from '@ngrx/store';
import { Community } from '..';
import { CreateCommunityDto } from '../interfaces/community.interface';
import { Profile } from '../../profile';

export const communityActions = createActionGroup({
  source: 'community',
  events: {
    'filter communities': props<{ filters: Record<string, any> }>(),
    'communities loaded': props<{ communities: Community[] }>(),
    'set page': props<{ page?: number }>(),
    'load community': props<{ communityId: number }>(),
    'community loaded': props<{ community: Community }>(),
    'load community subscribers': props<{ communityId: number; limit: number }>(),
    'community subscribers loaded': props<{ subscribers: Profile[] }>(),
    'create community': props<{ community: CreateCommunityDto }>(),
    'community created': props<{ community: Community }>(),
    'join community': props<{ communityId: number }>(),
    'leave community': props<{ communityId: number }>(),
    'community joined': props<{ communityId: number }>(),
    'community left': props<{ communityId: number }>(),
  },
});
