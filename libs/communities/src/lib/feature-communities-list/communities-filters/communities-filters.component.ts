import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  communityActions,
  CommunityTheme,
  selectCommunityFilters,
} from '@tt/data-access/communities';
import { debounceTime } from 'rxjs';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  StackInputComponent,
  SvgIconComponent,
  TtInputComponent,
  TtSelectComponent,
} from '@tt/common-ui';

@Component({
  selector: 'lib-communities-filters',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    TtInputComponent,
    SvgIconComponent,
    TtSelectComponent,
    StackInputComponent,
  ],
  templateUrl: './communities-filters.component.html',
  styleUrl: './communities-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommunitiesFiltersComponent {
  #fb = inject(FormBuilder);
  #store = inject(Store);

  filters = this.#store.selectSignal(selectCommunityFilters);

  searchForm = this.#fb.group({
    name: [''],
    themes: [''],
    tags: [[] as string[]],
  });

  themeOptions: CommunityTheme[] = ['PROGRAMMING', 'TECHNOLOGY', 'EDUCATION', 'SPORT', 'OTHER'];

  constructor() {
    effect(() => {
      this.searchForm.patchValue(this.filters(), {
        emitEvent: false,
      });
    });

    this.searchForm.valueChanges
      .pipe(debounceTime(300), takeUntilDestroyed())
      .subscribe((formValue) => {
        return this.#store.dispatch(communityActions.filterCommunities({ filters: formValue }));
      });
  }
}
