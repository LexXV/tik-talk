import { createActionGroup, props } from '@ngrx/store';
import { Community } from '..';

export const communityActions = createActionGroup({
  source: 'community',
  events: {
    'filter communities': props<{ filters: Record<string, any> }>(),
    'communities loaded': props<{ communities: Community[] }>(),
    'set page': props<{ page?: number }>(),
    'join community': props<{ communityId: number }>(),
    'leave community': props<{ communityId: number }>(),
    'community joined': props<{ communityId: number }>(),
    'community left': props<{ communityId: number }>(),
  },
});
