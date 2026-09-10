import { Route } from '@angular/router';
import { CommunitiesPageComponent } from './communities-page.component';
import { CommunityEffects, communityFeature } from '@tt/data-access/communities';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { CommunityPageComponent } from '../../feature-community-page';
import { PostEffects, postFeature } from '@tt/data-access/posts';

export const communitiesRoutes: Route[] = [
  {
    path: '',
    providers: [
      provideState(communityFeature),
      provideEffects(CommunityEffects),
      provideState(postFeature),
      provideEffects(PostEffects),
    ],
    children: [
      {
        path: '',
        component: CommunitiesPageComponent,
      },
      {
        path: ':id',
        component: CommunityPageComponent,
      },
    ],
  },
];
