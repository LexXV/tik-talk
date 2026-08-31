import { ChangeDetectionStrategy, Component, forwardRef, inject, signal } from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  FormGroup,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { TtInputComponent } from '..';
import { DadataService } from '@tt/data-access/common-ui';
import { debounceTime, switchMap, tap } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { DadataSuggestion } from '@tt/data-access/common-ui/interfaces/dadata.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lib-address-input',
  imports: [TtInputComponent, ReactiveFormsModule, AsyncPipe, JsonPipe],
  templateUrl: './address-input.component.html',
  styleUrl: './address-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AddressInputComponent),
    },
  ],
})
export class AddressInputComponent implements ControlValueAccessor {
  innerSearchControl = new FormControl();
  #dadataService = inject(DadataService);

  isDropdownOpened = signal<boolean>(true);

  addressForm = new FormGroup({
    city: new FormControl(''),
    street: new FormControl(''),
    building: new FormControl(''),
  });

  suggestions$ = this.innerSearchControl.valueChanges.pipe(
    debounceTime(500),
    switchMap((val) => {
      return this.#dadataService.getSuggestion(val).pipe(
        tap((res) => {
          this.isDropdownOpened.set(!!res.length);
        }),
      );
    }),
  );

  onChange: (value: string | null) => void = () => undefined;
  onTouched: () => void = () => undefined;

  constructor() {
    this.addressForm.valueChanges.pipe(takeUntilDestroyed()).subscribe((val) => {
      const address = [val.city, val.street, val.building].filter(Boolean).join(', ');

      this.onChange(address);
    });
  }

  writeValue(address: string | null): void {
    if (!address) {
      this.addressForm.reset({}, { emitEvent: false });
      this.innerSearchControl.reset('', { emitEvent: false });
      return;
    }

    const [city, street, building] = address.split(',').map((part) => part.trim());

    this.addressForm.patchValue(
      {
        city,
        street,
        building,
      },
      {
        emitEvent: false,
      },
    );

    this.innerSearchControl.patchValue(address, {
      emitEvent: false,
    });
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.innerSearchControl.disable({ emitEvent: false });
      this.addressForm.disable({ emitEvent: false });
    } else {
      this.innerSearchControl.enable({ emitEvent: false });
      this.addressForm.enable({ emitEvent: false });
    }
  }

  onSuggestionPick(suggest: DadataSuggestion) {
    this.isDropdownOpened.set(false);

    this.addressForm.patchValue({
      city: suggest.data.city,
      street: suggest.data.street,
      building: suggest.data.house,
    });

    const address = [suggest.data.city, suggest.data.street, suggest.data.house]
      .filter(Boolean)
      .join(', ');

    this.innerSearchControl.patchValue(address, {
      emitEvent: false,
    });

    this.onTouched();
  }

  markTouched() {
    this.onTouched();
  }
}
