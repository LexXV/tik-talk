import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseModalComponent } from '@tt/common-ui';

@Component({
  selector: 'lib-create-community-modal',
  imports: [BaseModalComponent],
  templateUrl: './create-community-modal.component.html',
  styleUrl: './create-community-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateCommunityModalComponent {}
