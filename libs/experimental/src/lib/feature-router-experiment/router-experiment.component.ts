import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'lib-router-experiment',
  imports: [NgComponentOutlet, RouterLink],
  templateUrl: './router-experiment.component.html',
  styleUrl: './router-experiment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouterExperimentComponent {
  lazyComponent = signal<any>(null);

  loadComponent() {
    import('./random-num/random-num.component').then((c) => {
      this.lazyComponent.set(c.RandomNumComponent);
    });
  }
}
