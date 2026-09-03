import { Component, effect, input } from '@angular/core';

@Component({
  selector: 'error',
  template: '<span class="error">404</span>',
  styles: [
    `
      :host {
        display: grid;
        place-items: center;
        height: 100dvh;
      }

      .error {
        font-size: 150px;
        font-weight: 800;
      }
    `,
  ],
})
export class ErrorPageComponent {
  id = input();

  constructor() {
    effect(() => {
      console.log(this.id());
    });
  }
}
