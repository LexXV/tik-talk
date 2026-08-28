import { Route } from '@angular/router';
import { CommunitiesPageComponent } from './communities-page.component';
import { CommunityEffects, communityFeature } from '@tt/data-access/communities';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';

export const communitiesRoutes: Route[] = [
  {
    path: '',
    component: CommunitiesPageComponent,
    providers: [provideState(communityFeature), provideEffects(CommunityEffects)],
  },
];
