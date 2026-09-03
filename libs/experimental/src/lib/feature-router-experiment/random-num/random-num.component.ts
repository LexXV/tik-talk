import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  inject,
  Input,
} from '@angular/core';
import { map, timer } from 'rxjs';

@Component({
  selector: 'lib-random-num',
  imports: [],
  templateUrl: './random-num.component.html',
  styleUrl: './random-num.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RandomNumComponent implements DoCheck {
  @Input() random = Math.random();

  random$ = timer(0, 1000).pipe(map(() => Math.random()));

  get random2() {
    return Math.random();
  }

  cdr = inject(ChangeDetectorRef);

  ngDoCheck() {
    console.log('DO CHECK');
  }
}
