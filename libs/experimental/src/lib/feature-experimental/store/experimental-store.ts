import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { ExperimentalAction, ExperimentalActionTypes } from './action';

export interface ExperimentalState {
  num: BehaviorSubject<number>;
}

@Injectable({
  providedIn: 'root'
})
export class ExperimentalStore implements ExperimentalState {
  num = new BehaviorSubject<number>(1);

  actionsStream$ = new Subject<ExperimentalAction<unknown>>();

  dispatch<T>(action: ExperimentalAction<T>) {
    this.actionsStream$.next(action);
  }

  select(key: keyof ExperimentalState) {
    return this[key].asObservable();
  }

  init() {
    return this.actionsStream$.asObservable()
      .pipe(
        tap(action => {
          // console.log(action);
          switch (action.type) {
            case ExperimentalActionTypes.ADD_NUMBER:
              this.num.next(this.num.value + (action.payload as number));
              break;
            case ExperimentalActionTypes.MULTIPLY:
              this.num.next(this.num.value * (action.payload as number));
          }
        })
      );
  }
}
