import { ChangeDetectionStrategy, Component, OnInit, output } from '@angular/core';

@Component({
  selector: 'lib-infinite-scroll-trigger',
  imports: [],
  templateUrl: './infinite-scroll-trigger.component.html',
  styleUrl: './infinite-scroll-trigger.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfiniteScrollTriggerComponent implements OnInit {
  loaded = output<void>();

  ngOnInit() {
    this.loaded.emit();
  }
}
