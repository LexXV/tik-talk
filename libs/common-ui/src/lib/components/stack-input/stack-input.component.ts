import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  HostBinding,
  HostListener,
  signal,
} from '@angular/core';
import { SvgIconComponent } from '..';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'lib-stack-input',
  imports: [SvgIconComponent, FormsModule],
  templateUrl: './stack-input.component.html',
  styleUrl: './stack-input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => StackInputComponent),
    },
  ],
})
export class StackInputComponent implements ControlValueAccessor {
  value = signal<string[]>([]);

  #disabled = false;

  @HostBinding('class.disabled')
  get disabled(): boolean {
    return this.#disabled;
  }

  innerInput = '';

  onChange: (value: string[] | null) => void = () => undefined;

  onTouched: () => void = () => undefined;

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: /*Keyboard*/ Event) {
    event.stopPropagation();
    event.preventDefault();

    if (!this.innerInput) return;

    this.value.set([...this.value(), this.innerInput]);
    this.innerInput = '';
    this.onChange(this.value());
    this.onTouched();
  }

  writeValue(stack: string[] | null) {
    if (!stack) {
      this.value.set([]);
      return;
    }

    this.value.set(stack);
  }

  registerOnChange(fn: (value: string[] | null) => void) {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.#disabled = isDisabled;
  }

  onTagDelete(i: number) {
    const tags = [...this.value()];
    tags.splice(i, 1);
    this.value.set(tags);
    this.onChange(tags);
    this.onTouched();
  }

  onBlur() {
    this.onTouched();
  }
}
