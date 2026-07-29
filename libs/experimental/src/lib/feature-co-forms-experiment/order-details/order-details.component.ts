import {
  ChangeDetectionStrategy,
  Component,
  Input,
  input,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { OrderDetailsForm } from '../clinical-order-form.types';

@Component({
  selector: 'app-order-details',
  imports: [ReactiveFormsModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderDetailsComponent {
  // form = input.required<FormGroup>();
  @Input({ required: true }) form!: FormGroup<OrderDetailsForm>;

  get orderName(): FormControl<string | null> {
    return this.form.controls.orderName;
  }
}
