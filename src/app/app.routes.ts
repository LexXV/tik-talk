import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { LayoutComponent } from './common-ui/layout/layout.component';
import { canActivateAuth } from './auth/access.guard';
import { SettingsPageComponent } from './pages/settings-page/settings-page.component';
import { NewsPageComponent } from './pages/news-page/news-page.component';
import { chatsRoutes } from './pages/chats-page/chatsRoutes';
import { COFormsExperimentComponent } from './experimental/co-forms-experiment/co-forms-experiment.component';

export const routes: Routes = [
  {
    path: '', component: LayoutComponent, children: [
      { path: '', redirectTo: 'profile/me', pathMatch: 'full' },
      { path: 'profile/:id', component: ProfilePageComponent },
      { path: 'settings', component: SettingsPageComponent },
      { path: 'search', component: SearchPageComponent },
      {
        path: 'chats',
        loadChildren: () => chatsRoutes
      },
      { path: 'news', component: NewsPageComponent },
    ],
    canActivate: [canActivateAuth]
  },
  { path: 'login', component: LoginPageComponent },
  { path: 'experimental', component: COFormsExperimentComponent }
];
