import { AbstractControl, AsyncValidator, ValidationErrors } from '@angular/forms';
import { inject, Injectable } from '@angular/core';
import { delay, map, Observable } from 'rxjs';
import { ApiService } from '@tt/data-access/common';
import { Profile, ProfileEndpoints } from '@tt/data-access/profile';

@Injectable({
  providedIn: 'root',
})
export class NameValidator implements AsyncValidator {
  api = inject(ApiService);

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.api.get<Profile[]>(ProfileEndpoints.getTestAccounts).pipe(
      delay(1000),
      map((users) => {
        return users.filter((u) => u.firstName === control.value).length > 0
          ? null
          : {
              nameValid: {
                message: `Имя должно быть одним из списка: ${users.map((u) => u.firstName).join(', ')}`,
              },
            };
      }),
    );
  }
}
