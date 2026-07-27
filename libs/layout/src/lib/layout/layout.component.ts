import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { ChatsService } from '@tt/data-access/chats';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, SidebarComponent],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent /*aka Reha General Layout PageComponent*/ {
  #chatsService = inject(ChatsService);

  constructor() {
    this.#chatsService.connectWs()
      .pipe(takeUntilDestroyed())
      .subscribe();
  }
}
