import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ExperimentalStore } from '@tt/experimental';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  // #experimentalStore = inject(ExperimentalStore);

  /*constructor() {
    this.#experimentalStore.init().subscribe()
  }*/
}
