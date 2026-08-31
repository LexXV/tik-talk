import { Injectable, Type, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  #host?: ViewContainerRef;

  registerHost(host: ViewContainerRef) {
    this.#host = host;
  }

  show(component: Type<unknown>) {
    if (!this.#host) return;

    this.#host.createComponent(component);
  }
}
