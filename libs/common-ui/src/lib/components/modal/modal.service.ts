import { ComponentRef, Injectable, Type, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  #host?: ViewContainerRef;
  #modalRef?: ComponentRef<unknown>;

  registerHost(host: ViewContainerRef) {
    this.#host = host;
  }

  show(component: Type<unknown>) {
    if (!this.#host) return;

    this.close();

    this.#modalRef = this.#host.createComponent(component);
  }

  close() {
    this.#modalRef?.destroy();
    this.#modalRef = undefined;
  }
}
