import { ChangeDetectionStrategy, Component, inject, ViewContainerRef } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'lib-modal-host',
  imports: [],
  templateUrl: './modal-host.component.html',
  styleUrl: './modal-host.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalHostComponent {
  #vcr = inject(ViewContainerRef);
  #modalService = inject(ModalService);

  constructor() {
    this.#modalService.registerHost(this.#vcr);
  }
}
