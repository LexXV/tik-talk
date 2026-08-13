import {
  ChangeDetectionStrategy,
  Component,
  inject,
  AfterViewInit,
  viewChild,
  ElementRef,
  OnDestroy,
  runInInjectionContext,
  Injector,
  DestroyRef,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  AsyncSubject,
  auditTime,
  BehaviorSubject,
  catchError,
  combineLatest,
  concat,
  concatMap,
  debounceTime,
  delay,
  distinctUntilChanged,
  exhaustMap,
  filter,
  finalize,
  find,
  first,
  firstValueFrom,
  forkJoin,
  from,
  fromEvent,
  interval,
  lastValueFrom,
  map,
  merge,
  mergeMap,
  MonoTypeOperatorFunction,
  Observable,
  of,
  OperatorFunction,
  pairwise,
  race,
  reduce,
  ReplaySubject,
  retry,
  scan,
  share,
  shareReplay,
  skip,
  Subject,
  Subscription,
  switchMap,
  take,
  takeUntil,
  tap,
  throttleTime,
  throwError,
  timer,
  withLatestFrom,
  zip,
} from 'rxjs';
import { MockService } from '../feature-forms-experiment/mock.service';
import { ProfileService } from '@tt/data-access/profile';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { ajax } from 'rxjs/ajax';
import { RouterLink } from '@angular/router';
import { DestroyService } from './destroy.service';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

function customFromEvent(el: HTMLElement, eventName: string) {
  return new Observable((subscriber) => {
    const handleEvent = (e: Event) => subscriber.next(e);

    el.addEventListener(eventName, handleEvent);

    return () => {
      console.log('DESTROYING');
      el.removeEventListener(eventName, handleEvent);
    };
  });
}

function customTimer(interval: number) {
  return new Observable((subscriber) => {
    let i = 0;

    const intId = setInterval(() => {
      subscriber.next(i++);
      console.log('INSIDE INTERVAL', i);
    }, interval);

    return () => {
      console.log('DESTROYING');
      clearInterval(intId);
    };
  });
}

function customTimeout(delay: number) {
  return new Observable((subscriber) => {
    let i = 0;

    const timeoutId = setTimeout(() => {
      subscriber.next(i++);
      console.log('INSIDE TIMEOUT', i);
    }, delay);

    return () => {
      console.log('DESTROYING');
      clearTimeout(timeoutId);
    };
  });
}

function random() {
  // const random = Math.random(); // Closures
  return new Observable((subscriber) => {
    const random = Math.random();
    if (random > 0.6) subscriber.error();
    if (random > 0.8) subscriber.complete();
    subscriber.next(random);
  });
}

function factorialize(n: number): number {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error('factorialize expects a non-negative integer');
  }

  if (n === 0 || n === 1) {
    return 1;
  }

  return n * factorialize(n - 1);
}

function squaring(): MonoTypeOperatorFunction<number> /*OperatorFunction<number, number>*/ {
  return (source) => {
    return new Observable((observer) => {
      return source.subscribe({
        next: (val) => observer.next(Math.pow(val, 2)),
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });
    });
  };
}

function customMap<T, K>(mapper: (val: T) => K): OperatorFunction<T, K> {
  return (source) => {
    return new Observable((observer) => {
      return source.subscribe({
        next: (val) => observer.next(mapper(val)),
        error: (err) => observer.error(err),
        complete: () => observer.complete(),
      });
    });
  };
}

@Component({
  selector: 'lib-rxjs-experiment',
  imports: [ReactiveFormsModule, AsyncPipe, JsonPipe, RouterLink],
  templateUrl: './rxjs-experiment.component.html',
  styleUrl: './rxjs-experiment.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DestroyService],
})
export class RxjsExperimentComponent /*implements /!*AfterViewInit*!/ OnDestroy*/ {
  mockService = inject(MockService);
  profileService = inject(ProfileService);

  formControl = new FormControl();

  accounts$ = this.profileService.getTestAccounts().pipe(shareReplay());
  // accounts$ = this.profileService.getTestAccounts().pipe(share());

  btn = viewChild.required<ElementRef<HTMLButtonElement>>('btn');

  subject$ = new BehaviorSubject<number>(1);
  // subject$ = new ReplaySubject<number>(/*6, 2000*/);
  // subject$ = new ReplaySubject<number>(Number.POSITIVE_INFINITY, 3000);
  // subject$ = new AsyncSubject<number>();

  isLoading$ = new Subject<boolean>();

  subNumber = 0;

  state: Record<string, number[]> = {};

  subscriptions: Subscription[] = []; /*= new Subscription();*/

  // destroy$ = new Subject<void>();
  destroy$ = inject(DestroyService);

  injector = inject(Injector);

  destroyRef = inject(DestroyRef);

  obs$ = timer(0, 100).pipe(
    map((val) => {
      return factorialize(val * 10);
    }),
    scan((acc, curr) => {
      return acc + curr;
    }, 0),
    tap((val) => console.log(val)),
  );

  // sig = toSignal(this.obs$);

  constructor() {
    /*this.formControl.valueChanges
      .pipe(
        debounceTime(500),
        filter((val) => val.length > 3),
        switchMap((val) => {
          return this.mockService.getData(val);
        }),
      )
      .subscribe((val) => console.log(val));*/
    // fromEvent(document.body, 'click')
    /*customFromEvent(document.body, 'click')
      // .pipe(map(() => 123))
      .pipe(take(10))
      .subscribe((val) => {
        console.log(val);
      });

    const sub = customTimer(2000).subscribe((val) => console.log(val));

    setTimeout(() => {
      sub.unsubscribe();
    }, 4000);

    const sub2 = customTimeout(2000).subscribe((val) => console.log(val));

    setTimeout(() => {
      sub2.unsubscribe();
    }, 4000);*/
    /*const obs = new Observable((subscriber) => {
      subscriber.next(1);
      subscriber.next(2);
      subscriber.next(3);
      subscriber.next(4);
      // subscriber.complete();
      subscriber.next(5);

      return () => {
        console.log('DESTROYING');
      };
    });

    const sub = obs.subscribe((val) => console.log(val));

    setTimeout(() => {
      sub.unsubscribe();
    }, 3000);*/

    ///////////////////////////////

    // const obs = random(); /*.pipe(shareReplay())*/
    /*obs.subscribe({
      next: () => console.log('next'),
      error: () => console.log('error'),
      complete: () => console.log('complete'),
    });*/
    /*const abc = obs.pipe(
      catchError((error) => {
        return of(null);
      }),
      finalize(() => null),
    );

    abc.subscribe();*/

    //////////////////////////////////////

    /*fetch('https://icherniakov.ru/yt-course/account/test_accounts').then((res) =>
      console.log(res.json()),
    );
    ajax('https://icherniakov.ru/yt-course/account/test_accounts').subscribe((val) => {
      console.log('ajax', val);
    });*/
    // const observable$ = of(1, 2, 3, 4, 5);
    // const observable$ = of([1, 2, 3, 4, 5]);
    // const observable$ = from([1, 2, 3, 4, 5]);
    // const observable$ = from(fetch('https://icherniakov.ru/yt-course/account/test_accounts'));
    // const observable$ = timer(0, 1000);
    // const observable$ = fromEvent(document.body, 'click');
    // const observable$ = throwError(() => 123);
    /*const observable$ = // fromEvent(document.body, 'click')
      /!*from([
      { a: 34 },
      { a: 32 },
      { a: 33 },
      { a: 34 },
      { a: 34 },
      { a: 23 },
    ])*!/ /!*[1, 2, 3, 4, 4, 4, 4, 4, 5, 6, 7]*!/
      timer(0, 500)


        /!*.pipe(
        // filter(val => val < 5),
        // take(1),
        // first(),
        // skip(3),
        // find((val) => val === 3),
        /!*distinctUntilChanged((a, b) => {
          return a.a === b.a;
        }),*!/
        /!*tap((val) => {
          console.log('tap', val);
        }),*!/
        tap(() => console.log('click')),
        // debounceTime(500),
        // throttleTime(500),
        auditTime(500),
      );*!/

        .pipe(
          take(6),
          // map((val) => val * 567),
          /!*reduce((acc, curr) => {
            return acc + curr;
          }, 0),*!/
          scan((acc, curr) => {
            return acc + curr;
          }, 0),
        );


    observable$.subscribe({
      next: (val) => console.log('next', val),
      error: (err) => console.log('error', err),
      complete: () => console.log('complete'),
    });*/

    ////////////////////////////////

    // const observable$ = combineLatest([
    // const observable$ = zip([
    /*const observable$ = forkJoin(
      /!*[
      interval(3000).pipe(
        map((i) => '1_' + i),
        take(2),
      ),
      interval(200).pipe(
        map((i) => '2_' + i),
        take(2),
      ),
      // fromEvent(document.body, 'click'),
    ]*!/
      {
        interval1: interval(3000).pipe(
          map((i) => '1_' + i),
          take(2),
        ),
        interval2: interval(200).pipe(
          map((i) => '2_' + i),
          take(2),
        ),
        // fromEvent(document.body, 'click'),
      },
    )*/
    // const observable$ = merge(
    // const observable$ = concat(
    /*const observable$ = merge(
      interval(3000).pipe(
        map((i) => '1_' + i),
        // take(1),
      ),
      interval(1000).pipe(map((i) => '2_' + i)),
    )

      .pipe(pairwise());*/
    /*const observable$ = race(
      interval(3000).pipe(
        map((i) => '1_' + i),
        take(2),
      ),
      interval(1000).pipe(
        map((i) => '2_' + i),
        take(7),
      ),
    )*/
    /*const obs$ = interval(1000).pipe(map((i) => '1_' + i));
    const obs2$ = interval(1000).pipe(map((i) => '2_' + i));
    const obs3$ = interval(1000).pipe(map((i) => '3_' + i));

    const observable$ = interval(3000).pipe(withLatestFrom(obs$, obs2$, obs3$));

    observable$.subscribe({
      next: (val) => console.log('next', val),
      error: (err) => console.log('error', err),
      complete: () => console.log('complete'),
    });*/

    /////////////////////////////////

    /*const observable$ = timer(0, 500).pipe(
      switchMap((val) => {
        if (val < 5) return of(val);

        return throwError(() => val);
      }),
      /!*catchError((err) => {
        return of(false);
      }),*!/
      // retry(1),
      retry({
        count: 5,
        resetOnSuccess: true,
        delay: (error, retryIndex) => {
          if (retryIndex === 5) {
            return timer(500);
          }
          throw error;
        },
      }),
    );

    observable$.subscribe({
      next: (val) => console.log('next', val),
      error: (err) => console.log('error', err),
      complete: () => console.log('complete'),
    });*/

    /////////////////////////////////

    /*const observable$ = timer(0, 500).pipe(
      // delay(5000)
      switchMap((val) => {
        if (val < 5) return of(val);

        return throwError(() => val);
      }),
      finalize(() => {
        console.log('finalize');
      }),
    );

    observable$.subscribe({
      next: (val) => console.log('next', val),
      error: (err) => console.log('error', err),
      complete: () => console.log('complete'),
    });*/
    // const observable$ = timer(0, 500).pipe(take(3));
    /*observable$
      .pipe(take(1))
      .toPromise()
      .then((res) => {
        console.log(res);
      });

    firstValueFrom(observable$).then((res) => {
      console.log('firstValueFrom', res);
    });*/
    //await
    /*lastValueFrom(observable$).then((res) => {
      console.log('lastValueFrom', res);
    });*/

    //////////////////////////////

    // console.log(this.subject$.value);
    /*console.log(this.subject$.getValue());

    this.subject$.subscribe((val) => {
      console.log(val);
    });

    this.subject$.next(2);
    this.subject$.next(3);
    this.subject$.next(4);
    this.subject$.next(5);*/

    ////////////////////

    /*timer(0, 100)
      .pipe(
        map((val) => {
          return factorialize(val * 10);
        }),
        scan((acc, curr) => {
          return acc + curr;
        }, 0),
        takeUntilDestroyed()
      )
      .subscribe((val) => {
        // this.state[this.subNumber + ''].push(val);
        console.log(/!*this.state*!/12312);
      });*/

    //////////////////////////////

    timer(0, 1000)
      .pipe(
        tap((val) => console.log('Before', val)),
        // map((val) => val * val),
        // map((val) => '12'),
        // squaring(),
        // map(() => ),
        customMap((val) => val * val),
      )
      .subscribe((val) => console.log('After', val));
  }

  /*ngAfterViewInit() {
    const btn = this.btn().nativeElement as HTMLButtonElement;

    const getAsyncObs = (num: number) => {
      const time = 4000 * Math.random();
      return timer(Math.max(time, 1500)).pipe(
        map(() => num),
        first(),
      );
    };

    let index = 0;

    fromEvent(btn, 'click')
      .pipe(
        // switchMap(() => {
        // mergeMap(() => {
        // concatMap(() => {
        exhaustMap(
          () => {
            console.log('IN', (index += 1));
            return getAsyncObs(index);
          } /!*, 3*!/,
        ),
      )
      .subscribe((resultIndex) => {
        console.log('OUT', resultIndex);
      });
  }*/

  load() {
    this.isLoading$.next(true);

    timer(3000).subscribe(() => {
      this.isLoading$.next(false);
    });
  }

  addSub() {
    this.subNumber += 1;
    this.state[this.subNumber + ''] = [];

    /*const sub =*/ timer(0, 100)
      .pipe(
        map((val) => {
          return factorialize(val * 10);
        }),
        scan((acc, curr) => {
          return acc + curr;
        }, 0),
        // takeUntil(this.destroy$),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((val) => {
        this.state[this.subNumber + ''].push(val);
        console.log(this.state);
      });

    // this.subscriptions.add(sub);
    // this.subscriptions.push(sub);

    /*runInInjectionContext(this.injector, () => {
      timer(0, 100)
        .pipe(
          map((val) => {
            return factorialize(val * 10);
          }),
          scan((acc, curr) => {
            return acc + curr;
          }, 0),
          takeUntilDestroyed(),
        )
        .subscribe((val) => {
          this.state[this.subNumber + ''].push(val);
          console.log(this.state);
        });
    })*/
  }

  /*ngOnDestroy() {
    // this.subscriptions.unsubscribe();
    /!*this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });*!/
    this.destroy$.next();
    this.destroy$.complete();
  }*/
}
