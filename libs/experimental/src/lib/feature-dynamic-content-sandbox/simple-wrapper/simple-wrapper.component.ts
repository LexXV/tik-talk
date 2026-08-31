import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'lib-simple-wrapper',
  imports: [],
  templateUrl: './simple-wrapper.component.html',
  styleUrl: './simple-wrapper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleWrapperComponent {}
