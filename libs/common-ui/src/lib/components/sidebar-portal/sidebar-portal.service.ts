import { Injectable, TemplateRef, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SidebarPortalService {
  #container?: ViewContainerRef;

  registerContainer(vcr: ViewContainerRef) {
    this.#container = vcr;
  }

  render(templ: TemplateRef<unknown>) {
    setTimeout(() => {
      this.#container?.createEmbeddedView(templ);
    });
  }

  destroy() {
    this.#container?.clear();
  }
}
