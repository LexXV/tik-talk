import { Component, inject } from '@angular/core';
import { ProfileCardComponent } from '../../ui';
import { selectFilteredProfiles } from '../../data';
import { ProfileFiltersComponent } from '..';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-search-page',
  imports: [ProfileCardComponent, ProfileFiltersComponent],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
})
export class SearchPageComponent {
  store = inject(Store);
  profiles = this.store.selectSignal(selectFilteredProfiles);
}
