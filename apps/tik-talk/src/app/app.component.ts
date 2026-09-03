import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ExperimentalStore } from '@tt/experimental';
import { PortalService } from '@tt/common-ui';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  // #experimentalStore = inject(ExperimentalStore);
  #portalService = inject(PortalService);
  // #router = inject(Router);

  @ViewChild('portalHost', { read: ViewContainerRef })
  set portalHost(portalHost: ViewContainerRef) {
    if (!portalHost) return;

    this.#portalService.registerContainer(portalHost);
  }

  /*constructor() {
    // this.#experimentalStore.init().subscribe()
    this.#router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // страница открыта
      }
    });
  }*/
}
