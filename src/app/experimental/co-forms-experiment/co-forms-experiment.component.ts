import { Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormRecord, ReactiveFormsModule, Validators } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { PatientCriteriaComponent } from './patient-criteria/patient-criteria.component';
import {
  AlertsForm,
  ClinicalOrderForm,
  DiagnosisForm, LabForm, Medication,
  MedicationForm,
  OrderDetailsForm,
  PatientCriteriaForm, SchedulingForm
} from './clinical-order-form.types';
import { COMockService } from './co-mock.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { schedulingDateRangeValidator } from './scheduling.validator';
import { MaskitoDirective } from '@maskito/angular';
import { maskitoNumber } from '@maskito/kit';

@Component({
  selector: 'co-forms-experiment',
  imports: [
    ReactiveFormsModule,
    JsonPipe,
    OrderDetailsComponent,
    PatientCriteriaComponent,
    MaskitoDirective
  ],
  templateUrl: './co-forms-experiment.component.html',
  styleUrl: './co-forms-experiment.component.scss'
})
export class COFormsExperimentComponent {
  mockService = inject(COMockService);

  readonly dosageMask = maskitoNumber({
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    postfix: ' mg'
  });

  form = new FormGroup<ClinicalOrderForm>({
    orderDetails: new FormGroup<OrderDetailsForm>({
      orderName: new FormControl('', Validators.required),
      physician: new FormControl(''),
      priority: new FormControl('Routine')
    }),

    patientCriteria: new FormGroup<PatientCriteriaForm>({
      patientAge: new FormControl<number | null>(null),
      patientGender: new FormControl('')
    }),

    scheduling: new FormGroup<SchedulingForm>(
      {
        startDate: new FormControl(null),
        endDate: new FormControl(null),
        frequency: new FormControl('Once')
      },
      {
        validators: [
          schedulingDateRangeValidator()
        ]
      }
    ),

    alerts: new FormGroup<AlertsForm>({
      notifyPhysician: new FormControl(false),
      criticalResultAlert: new FormControl(false)
    }),

    medications: new FormArray<FormGroup<MedicationForm>>([]),

    diagnoses: new FormArray<FormGroup<DiagnosisForm>>([]),

    labs: new FormArray<FormGroup<LabForm>>([]),

    metadata: new FormRecord<FormControl<string | null>>({}),

    customFields: new FormRecord<FormControl<string | null>>({})
  });

  constructor() {
    this.updatePhysicianState(
      this.orderDetails.controls.priority.value
    );

    this.orderDetails.controls.priority.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(priority => {
        this.updatePhysicianState(priority);
      });

    this.orderDetails.controls.physician.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(physician => console.log('Physician changed:', physician));

    this.loadMedications();
    this.loadMetadata();
  }

  get orderDetails(): FormGroup<OrderDetailsForm> {
    return this.form.controls.orderDetails;
  }

  get patientCriteria(): FormGroup<PatientCriteriaForm> {
    return this.form.controls.patientCriteria;
  }

  get scheduling(): FormGroup<SchedulingForm> {
    return this.form.controls.scheduling;
  }

  get alerts(): FormGroup<AlertsForm> {
    return this.form.controls.alerts;
  }

  createMedicationForm(
    medication?: Medication
  ): FormGroup<MedicationForm> {
    return new FormGroup<MedicationForm>({
      medicationName: new FormControl(medication?.medicationName ?? ''),
      dosage: new FormControl(medication?.dosage ?? '')
    });
  }

  createDiagnosisForm(): FormGroup<DiagnosisForm> {
    return new FormGroup<DiagnosisForm>({
      diagnosisCode: new FormControl(''),
      diagnosisDescription: new FormControl('')
    });
  }

  createLabForm(): FormGroup<LabForm> {
    return new FormGroup<LabForm>({
      testName: new FormControl(''),
      testCode: new FormControl('')
    });
  }

  get medications(): FormArray<FormGroup<MedicationForm>> {
    return this.form.controls.medications;
  }

  addMedication(): void {
    this.medications.push(this.createMedicationForm());
  }

  insertMedication(index: number): void {
    this.medications.insert(
      index,
      this.createMedicationForm({
        medicationName: 'New Medication',
        dosage: '50 mg'
      })
    );
  }

  removeMedication(index: number): void {
    this.medications.removeAt(index);
  }

  get diagnoses(): FormArray<FormGroup<DiagnosisForm>> {
    return this.form.controls.diagnoses;
  }

  addDiagnosis(): void {
    this.diagnoses.push(this.createDiagnosisForm());
  }

  removeDiagnosis(index: number): void {
    this.diagnoses.removeAt(index);
  }

  get labs(): FormArray<FormGroup<LabForm>> {
    return this.form.controls.labs;
  }

  addLab(): void {
    this.labs.push(this.createLabForm());
  }

  removeLab(index: number): void {
    this.labs.removeAt(index);
  }

  get metadata(): FormRecord<FormControl<string | null>> {
    return this.form.controls.metadata;
  }

  addMetadataField(key: string, value: string): void {
    this.metadata.addControl(
      key,
      new FormControl(value)
    );
  }

  removeMetadataField(key: string): void {
    this.metadata.removeControl(key);
  }

  get metadataKeys(): string[] {
    return Object.keys(this.metadata.controls);
  }

  get customFields(): FormRecord<FormControl<string | null>> {
    return this.form.controls.customFields;
  }

  addCustomField(key: string, value: string): void {
    this.customFields.addControl(
      key,
      new FormControl(value)
    );
  }

  removeCustomField(key: string): void {
    this.customFields.removeControl(key);
  }

  get customFieldKeys(): string[] {
    return Object.keys(this.customFields.controls);
  }

  submit(): void {
    this.addCustomField('insuranceNumber', '123456789');

    this.addCustomField('ward', 'ICU');

    this.form.markAllAsTouched();

    console.log('form.value');
    console.log(this.form.value);

    console.log('----------------');

    console.log('form.getRawValue()');
    console.log(this.form.getRawValue());
  }

  updatePhysicianState(priority: string | null): void {
    const physician = this.orderDetails.controls.physician;

    physician.clearValidators();

    if (priority === 'Routine') {
      physician.disable();
      physician.updateValueAndValidity();
      return;
    }

    physician.enable();

    physician.setValidators([Validators.required]);

    if (priority === 'STAT') {
      physician.setValue(
        'Emergency Team',
        {
          emitEvent: false
        }
      );
    }

    physician.updateValueAndValidity();
  }

  loadMedications(): void {
    this.mockService.getMedications()
      /*.pipe(takeUntilDestroyed())*/
      .subscribe(medications => {
        this.medications.clear();

        medications.forEach(medication => {
          this.medications.push(
            this.createMedicationForm(medication)
          );
        });
      });
  }

  loadMetadata(): void {
    this.mockService.getMetadataFields()
      /*.pipe(takeUntilDestroyed())*/
      .subscribe(fields => {
        Object.keys(this.metadata.controls).forEach(key => {
          this.metadata.removeControl(key);
        });

        fields.forEach(field => {
          this.metadata.addControl(
            field.key,
            new FormControl(field.value)
          );
        });
      });
  }
}
