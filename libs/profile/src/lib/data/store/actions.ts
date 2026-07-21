import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Profile } from '@tt/interfaces/profile';

export const profileActions = createActionGroup({
  source: 'profile',
  events: {
    'filter events': props<{ filters: Record<string, any> }>(),
    'profiles loaded': props<{ profiles: Profile[] }>(),
    'load me': emptyProps(),
    'load me success': props<{ me: Profile; }>(),
    'load profile': props<{ id: string }>(),
    'load profile success': props<{ profile: Profile }>(),
    'load subscribers': props<{ limit: number }>(),
    'load subscribers success': props<{ subscribers: Profile[] }>(),
    'update profile': props<{ profile: Partial<Profile> }>(),
    'update profile success': props<{ profile: Profile }>(),
    'upload avatar': props<{ avatar: File }>(),
    'upload avatar success': props<{ profile: Profile }>()
  }
});
