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
  selector: 'lib-tt-stack-input',
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

  @HostListener('keydown.enter', ['$event'])
  onEnter(event: /*Keyboard*/Event) {
    event.stopPropagation();
    event.preventDefault();

    if (!this.innerInput) return;

    this.value.set([...this.value(), this.innerInput]);
    this.innerInput = '';
    this.onChange(this.value());
  }

  writeValue(stack: string[] | null) {
    if (!stack) {
      this.value.set([]);
      return;
    }

    this.value.set(stack);
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.#disabled = isDisabled;
  }

  onChange(value: string[] | null) {}

  onTouched() {}

  onTagDelete(i: number) {
    const tags = [...this.value()];
    tags.splice(i, 1);
    this.value.set(tags);
    this.onChange(tags);
  }
}
