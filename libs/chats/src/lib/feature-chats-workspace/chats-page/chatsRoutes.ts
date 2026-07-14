import { Route } from '@angular/router';
import { ChatsPageComponent } from '..';
import { ChatWorkspaceComponent } from '../chat-workspace/chat-workspace.component';

export const chatsRoutes: Route[] = [
  {
    path: '',
    component: ChatsPageComponent,
    children: [{ path: ':id', component: ChatWorkspaceComponent }],
  },
];
