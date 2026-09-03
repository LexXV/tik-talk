import { Route } from '@angular/router';
import { ChatsPageComponent } from '..';

export const chatsRoutes: Route[] = [
  {
    path: '',
    component: ChatsPageComponent,
    children: [
      {
        path: ':id',
        loadComponent: () =>
          import('../chat-workspace/chat-workspace.component').then(
            (c) => c.ChatWorkspaceComponent,
          ),
      },
    ],
  },
];
