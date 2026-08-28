import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'lib-tt-select',
  imports: [FormsModule],
  templateUrl: './tt-select.component.html',
  styleUrl: './tt-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TtSelectComponent),
    },
  ],
})
export class TtSelectComponent implements ControlValueAccessor {
  options = input<string[]>([]);

  value = signal<string>('');
  disabled = signal(false);

  writeValue(val: string | null) {
    this.value.set(val ?? '');
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled.set(isDisabled);
  }

  onChange(value: string | null) {}
  onTouched() {}

  onModelChange(val: string | null) {
    this.value.set(val ?? '');
    this.onChange(val ?? '');
  }

  onBlur() {
    this.onTouched();
  }
}
