import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-base-modal',
  imports: [],
  templateUrl: './base-modal.component.html',
  styleUrl: './base-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaseModalComponent {}
