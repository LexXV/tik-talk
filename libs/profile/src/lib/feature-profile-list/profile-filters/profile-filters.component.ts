import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { profileActions, selectProfileFilters } from '@tt/data-access/profile';
import { debounceTime, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'lib-profile-filters',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './profile-filters.component.html',
  styleUrl: './profile-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFiltersComponent implements OnDestroy {
  fb = inject(FormBuilder);
  store = inject(Store);

  filters = this.store.selectSignal(selectProfileFilters);

  searchForm = this.fb.group({
    firstName: [''],
    lastName: [''],
    stack: [''],
  });

  searchFormSub!: Subscription;

  constructor() {
    effect(() => {
      this.searchForm.patchValue(this.filters(), {
        emitEvent: false,
      });
    });

    this.store.dispatch(profileActions.filterEvents({ filters: this.filters() }));

    this.searchFormSub = this.searchForm.valueChanges
      .pipe(
        debounceTime(300),
        /*
        takeUntilDestroyed()*/ // Starting from Angular 17
        /*,
        takeUntil()*/ // Before Angular 17
      )
      .subscribe((formValue) => {
        return this.store.dispatch(profileActions.filterEvents({ filters: formValue }));
      });
  }

  // Before Angular 17
  ngOnDestroy() {
    this.searchFormSub.unsubscribe();
  }
}
