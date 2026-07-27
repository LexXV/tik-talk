import { Routes } from '@angular/router';
import { canActivateAuth, LoginPageComponent } from '@tt/auth';
import { ProfilePageComponent, SearchPageComponent, SettingsPageComponent } from '@tt/profile';
import { LayoutComponent } from '@tt/layout';
import { NewsPageComponent } from '@tt/news';
import { chatsRoutes } from '@tt/chats';
import { COFormsExperimentComponent, ExperimentalComponent } from '@tt/experimental';
import { provideState } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { PostEffects, postFeature } from '@tt/data-access/posts';
import { ProfileEffects, profileFeature } from '@tt/data-access/profile';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      {
        path: 'profile/:id',
        component: ProfilePageComponent,
        providers: [
          provideState(postFeature),
          provideEffects(PostEffects),
          provideState(profileFeature),
          provideEffects(ProfileEffects),
        ]
      },
      {
        path: 'settings',
        component: SettingsPageComponent,
        providers: [
          provideState(profileFeature),
          provideEffects(ProfileEffects),
        ]
      },
      {
        path: 'search',
        component: SearchPageComponent,
        providers: [
          provideState(profileFeature),
          provideEffects(ProfileEffects)
        ]
      },
      {
        path: 'chats',
        loadChildren: () => chatsRoutes,
      },
      { path: 'news', component: NewsPageComponent },
    ],
    canActivate: [canActivateAuth],
  },
  { path: 'login', component: LoginPageComponent },
  { path: 'experimental', component: COFormsExperimentComponent },
  { path: 'experimental2', component: ExperimentalComponent },
];
