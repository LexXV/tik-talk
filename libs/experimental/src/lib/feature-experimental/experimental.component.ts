import { Component, inject } from '@angular/core';
import { ExperimentalStore } from './store/experimental-store';
import { addNumber, multiplyNumber } from './store/action';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'tt-experimental',
  imports: [
    AsyncPipe
  ],
  templateUrl: './experimental.component.html',
  styleUrl: './experimental.component.scss'
})
export class ExperimentalComponent {
  #experimentalStore = inject(ExperimentalStore);

  num$ = this.#experimentalStore.select('num');

  increment(value: number) {
    this.#experimentalStore.dispatch(addNumber(value));
    // this.#experimentalStore.dispatch(multiplyNumber(value));
  }
}
