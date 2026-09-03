import { Router, Routes } from '@angular/router';
import { canActivateAuth, LoginPageComponent } from '@tt/auth';
import { ProfilePageComponent, SearchPageComponent, SettingsPageComponent } from '@tt/profile';
import { LayoutComponent } from '@tt/layout';
import { NewsPageComponent } from '@tt/news';
import {
  COFormsExperimentComponent,
  DynamicContentSandboxComponent,
  ExperimentalComponent,
  RouterExperimentComponent,
  RxjsExperimentComponent,
} from '@tt/experimental';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { PostEffects, postFeature } from '@tt/data-access/posts';
import { ProfileEffects, profileFeature } from '@tt/data-access/profile';
import { communitiesRoutes } from '@tt/communities';
import { ErrorPageComponent } from './error.component';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        redirectTo: (route) => {
          const router = inject(Router);
          console.log(route);
          return router.createUrlTree(['profile', 'me']);
        },
        pathMatch: 'full',
      },
      /*{
        component: SearchPageComponent,
        matcher: (segments /!*, group, route*!/) => {
          if (segments.length === 2 && segments[0].path === 'profile') {
            const id = segments[1].path;

            if (id.startsWith('1')) {
              return {
                consumed: segments,
                posParams: {
                  id: segments[1],
                },
              };
            }
          }
          return null;
        },
      },*/
      {
        path: 'profile/:id',
        component: ProfilePageComponent,
        children: [{ path: 'err', component: ErrorPageComponent }],
        providers: [
          provideState(postFeature),
          provideEffects(PostEffects),
          provideState(profileFeature),
          provideEffects(ProfileEffects),
        ],
      },
      {
        path: 'settings',
        component: SettingsPageComponent,
        providers: [provideState(profileFeature), provideEffects(ProfileEffects)],
      },
      {
        path: 'search',
        component: SearchPageComponent,
        providers: [provideState(profileFeature), provideEffects(ProfileEffects)],
      },
      {
        path: 'chats',
        // loadChildren: () => chatsRoutes,
        loadChildren: () => import('@tt/chats').then((m) => m.chatsRoutes),
        data: { preload: true },
      },
      { path: 'news', component: NewsPageComponent },
      {
        path: 'communities',
        loadChildren: () => communitiesRoutes,
      },
    ],
    canActivate: [canActivateAuth],
  },
  { path: 'login', component: LoginPageComponent },
  { path: 'experimental', component: COFormsExperimentComponent },
  { path: 'experimental2', component: ExperimentalComponent },
  { path: 'experimental3', component: RxjsExperimentComponent },
  { path: 'experimental4', component: RouterExperimentComponent },
  { path: 'dynamic', component: DynamicContentSandboxComponent },
  { path: '**', component: ErrorPageComponent },
];
