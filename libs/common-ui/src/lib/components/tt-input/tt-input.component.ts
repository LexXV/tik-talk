import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  output,
  signal,
  OnDestroy,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'lib-tt-input',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './tt-input.component.html',
  styleUrl: './tt-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TtInputComponent),
    },
  ],
})
export class TtInputComponent implements ControlValueAccessor /*, OnDestroy*/ {
  type = input<'text' | 'password'>('text');
  variant = input<'default' | 'underline'>('default');
  placeholder = input<string>();

  disabled = signal<boolean>(false);

  onChange: (value: string | null) => void = () => undefined;
  onTouched: () => void = () => undefined;

  value = signal<string | null>(null);

  blurred = output<void>();

  /*constructor() {
    console.log('CREATED');
  }

  ngOnDestroy() {
    console.log('DESTROYED');
  }*/

  writeValue(val: string | null) {
    this.value.set(val);
  }

  registerOnChange(fn: (value: string | null) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled.set(isDisabled);
  }

  onModelChange(val: string | null) {
    this.value.set(val);
    this.onChange(val);
  }

  onBlur() {
    this.onTouched();
    this.blurred.emit();
  }
}
