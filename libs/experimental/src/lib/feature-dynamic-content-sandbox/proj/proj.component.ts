import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-proj',
  imports: [],
  templateUrl: './proj.component.html',
  styleUrl: './proj.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjComponent {}
