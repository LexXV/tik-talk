import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ModalService, SvgIconComponent } from '../..';

@Component({
  selector: 'lib-base-modal',
  imports: [SvgIconComponent],
  templateUrl: './base-modal.component.html',
  styleUrl: './base-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseModalComponent {
  #modalService = inject(ModalService);

  close() {
    this.#modalService.close();
  }
}
