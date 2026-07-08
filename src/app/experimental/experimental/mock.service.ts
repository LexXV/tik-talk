import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Feature {
  code: string;
  label: string;
  value: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MockService {

  getAddresses() {
    return of([
      {
        'city': 'Москва',
        'street': 'Тверская',
        'building': 14,
        'apartment': 32
      },
      {
        'city': 'Санкт-Петербург',
        'street': 'Ленина',
        'building': 100,
        'apartment': 30
      }
    ]);
  }

  getFeatures(): Observable<Feature[]> {
    return of([
      {
        code: 'lift',
        label: 'Подъем на этаж',
        value: true
      },
      {
        code: 'strong-package',
        label: 'Усиленная упаковка',
        value: true
      },
      {
        code: 'fast',
        label: 'Ускоренная доставка',
        value: false
      }
    ]);
  }
}
