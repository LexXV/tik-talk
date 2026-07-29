import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PatientCriteriaForm } from '../clinical-order-form.types';

@Component({
  selector: 'app-patient-criteria',
  imports: [ReactiveFormsModule],
  templateUrl: './patient-criteria.component.html',
  styleUrl: './patient-criteria.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PatientCriteriaComponent {
  @Input({ required: true }) form!: FormGroup<PatientCriteriaForm>;
}
